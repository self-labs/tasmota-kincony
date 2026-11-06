# autoexec.be - network watchdog for the house's Tasmota boards (A16v3, AG8).
#
# Tasmota runs /autoexec.be at every boot. With Wifi 0 the cable is the board's
# only way to the network, and the firmware sets the Ethernet up once, at boot
# (EthernetInit, xdrv_82_esp32_ethernet.ino:314). When that fails, the board
# keeps running its rules but stays off the network until someone power cycles
# it, and the restart Tasmota does after 100 failed Wi-Fi attempts never runs
# with Wifi 0 (support_tasmota.ino:1646). This watchdog restarts the board
# instead, when the network has not come up since boot.
#
# A network that came up and dropped later is left alone: that is a cable, a
# switch or a server turned off, and a restart brings none of them back. The
# wait starts at 10 minutes and doubles after each restart in a row, up to 80,
# so a switch that stays off all night costs a handful of restarts instead of
# one every 10 minutes. It goes back to 10 as soon as the network comes up.
# The count lives in _persist.json, written only at a restart and once after.
#
# "Network up" is Tasmota's own state, the one that gates MQTT: Ethernet with
# a link and an address, or Wi-Fi (support_tasmota.ino:1343). Tasmota tells
# the drivers every second (support_tasmota.ino:1702 and 1713). The console
# command EthWatchdog shows the state.

import persist

class EthWatchdog
  var came_up   # the network came up since boot
  var down_s    # seconds without network since boot, until it came up

  def init()
    self.came_up = false
    self.down_s = 0
    tasmota.add_driver(self)
    tasmota.add_cmd("EthWatchdog", / cmd, idx, payload -> self.status())
  end

  def restarts()
    return persist.find("eth_watchdog_restarts", 0)
  end

  def limit_s()
    var n = self.restarts()
    return 600 << (n < 3 ? n : 3)   # 10, 20, 40, 80 minutes
  end

  def network_up()
    if self.came_up return end
    self.came_up = true
    if self.restarts() != 0
      persist.eth_watchdog_restarts = 0
      persist.save()
    end
  end

  def network_down()
    if self.came_up return end
    self.down_s += 1
    if self.down_s == self.limit_s()
      persist.eth_watchdog_restarts = self.restarts() + 1
      persist.save()
      tasmota.log(format("ETH: no network %i min after boot, restarting", self.down_s / 60), 2)
      tasmota.cmd("Restart 1", true)
    end
  end

  def status()
    tasmota.resp_cmnd(format('{"EthWatchdog":{"CameUp":%s,"SecondsDown":%i,"LimitMinutes":%i,"Restarts":%i}}',
      self.came_up, self.down_s, self.limit_s() / 60, self.restarts()))
  end
end

eth_watchdog = EthWatchdog()

# The A16v3 display script, on a board that has the display on.
import path
if path.exists("display.be") load("display.be") end
