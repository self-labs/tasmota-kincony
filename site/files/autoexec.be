# autoexec.be - network watchdog for the house's Tasmota boards (A16v3, AG8).
#
# Tasmota runs /autoexec.be at every boot. The firmware sets the Ethernet up
# once, at boot (EthernetInit, xdrv_82_esp32_ethernet.ino:314). When that
# fails, the cable stays dead until the board restarts. With Wifi 0 the board
# keeps running its rules but stays off the network until someone power cycles
# it, and the restart Tasmota does after 100 failed Wi-Fi attempts never runs
# with Wifi 0 (support_tasmota.ino:1646). With Wi-Fi on as a backup the board
# carries on over Wi-Fi, but the cable never comes back by itself. This
# watchdog restarts the board instead, when the cable has not come up since
# boot, whether or not Wi-Fi is carrying the board meanwhile.
#
# A cable that came up and dropped later is left alone: that is a cable, a
# switch or a server turned off, and a restart brings none of them back. The
# wait starts at 10 minutes and doubles after each restart in a row, up to 80,
# so a switch that stays off all night costs a handful of restarts instead of
# one every 10 minutes. It goes back to 10 as soon as the cable comes up.
# The count lives in _persist.json, written only at a restart and once after.
#
# Back on the cable: a board that fell back to Wi-Fi keeps its MQTT connection
# there when the cable returns, and a reconnect still picks the Wi-Fi (seen on a
# Pelle A16v3, 13 Nov 2026: cable pulled and put back, MQTT stayed on the Wi-Fi
# address). Cycling the Wi-Fi (Wifi 0, then Wifi 1) makes MQTT reconnect while the
# cable is the only way out, and it stays on the cable after the Wi-Fi returns.
# The Wi-Fi flag ends ON, so the Wi-Fi is still there for the next drop and for
# the safeboot partition (a file upload in Firmware Upgrade reboots into it).
#
# "Cable up" is the Ethernet having an address (tasmota.eth()["up"]). A board
# without Ethernet (EthType 0) watches Tasmota's network state instead, the one
# that gates MQTT (support_tasmota.ino:1343). Tasmota calls network_up or
# network_down every second (support_tasmota.ino:1702 and 1713). The console
# command EthWatchdog shows the state.

import persist

class EthWatchdog
  var cable     # the board has Ethernet (EthType not 0): watch the cable, not the network
  var came_up   # the cable (the network, without Ethernet) came up since boot
  var down_s    # seconds since boot without it, until it came up

  def init()
    var eth_type = tasmota.cmd("EthType", true)
    self.cable = eth_type != nil && eth_type.find("EthType", 0) != 0
    self.came_up = false
    self.down_s = 0
    tasmota.add_driver(self)
    tasmota.add_cmd("EthWatchdog", / cmd, idx, payload -> self.status())
    if self.cable tasmota.add_rule("ETH#Connected", / -> self.cable_back()) end
  end

  def cable_back()       # the cable got an address; at boot the Wi-Fi is not up yet, so nothing to do
    if !tasmota.wifi().find("up", false) return end
    tasmota.set_timer(5000, / -> self.cycle_wifi())
  end

  def cycle_wifi()
    if !tasmota.eth().find("up", false) return end
    tasmota.log("ETH: cable back while on Wi-Fi, cycling the Wi-Fi so MQTT returns to the cable", 2)
    tasmota.cmd("Wifi 0", true)
    tasmota.set_timer(3000, / -> tasmota.cmd("Wifi 1", true))
  end

  def restarts()
    return persist.find("eth_watchdog_restarts", 0)
  end

  def limit_s()
    var n = self.restarts()
    return 600 << (n < 3 ? n : 3)   # 10, 20, 40, 80 minutes
  end

  def network_up()       # Ethernet or Wi-Fi is up: with Ethernet, only the cable counts
    self.tick(!self.cable || tasmota.eth().find("up", false))
  end

  def network_down()
    self.tick(false)
  end

  def tick(up)
    if self.came_up return end
    if up
      self.came_up = true
      if self.restarts() != 0
        persist.eth_watchdog_restarts = 0
        persist.save()
      end
      return
    end
    self.down_s += 1
    if self.down_s == self.limit_s()
      persist.eth_watchdog_restarts = self.restarts() + 1
      persist.save()
      tasmota.log(format("ETH: %s not up %i min after boot, restarting",
        self.cable ? "cable" : "network", self.down_s / 60), 2)
      tasmota.cmd("Restart 1", true)
    end
  end

  def status()
    tasmota.resp_cmnd(format('{"EthWatchdog":{"Watches":"%s","CameUp":%s,"SecondsDown":%i,"LimitMinutes":%i,"Restarts":%i}}',
      self.cable ? "cable" : "network", self.came_up, self.down_s, self.limit_s() / 60, self.restarts()))
  end
end

eth_watchdog = EthWatchdog()

# The A16v3 display script, on a board that has the display on.
import path
if path.exists("display.be") load("display.be") end
