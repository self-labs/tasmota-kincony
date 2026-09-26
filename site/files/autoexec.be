# autoexec.be - the board's addresses on the A16v3's own SSD1306 display.
#
# Tasmota runs /autoexec.be at every boot. This one writes the device name and
# the Wi-Fi and cable addresses on the display, and rewrites them every 10
# seconds only when something changed, so the board can be found without a
# computer. "-" means that side has no address. It needs /display.ini on the
# same file system; DisplayMode 0 keeps Tasmota's own screens from drawing
# over the text.

class IpDisplay
  var name
  var last

  def init()
    self.name = tasmota.cmd("DeviceName", true).find("DeviceName", "Tasmota")
    self.last = ""
    tasmota.cmd("DisplayMode 0", true)
    tasmota.add_cron("*/10 * * * * *", / -> self.show(), "ip_display")
    self.show()
  end

  def show()
    var wifi = tasmota.wifi().find("ip", "-")
    var cable = tasmota.eth().find("ip", "-")
    var text = format("[z][x0y0]%s[x0y20]WiFi %s[x0y36]Cabo %s", self.name, wifi, cable)
    if text != self.last
      self.last = text
      tasmota.cmd("DisplayText " + text, true)
    end
  end
end

ip_display = IpDisplay()
