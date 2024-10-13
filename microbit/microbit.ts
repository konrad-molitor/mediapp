let volume = 128; // Initial volume (half of the max)
let isAlerting = false; // Flag to control alert state
let alertInterval: number;

bluetooth.startUartService();

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
  let incoming = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));

  if (incoming === "test_string") {
    // For test_string, show the checkmark and beep once
    basic.showIcon(IconNames.Yes);
    music.playTone(262, music.beat(BeatFraction.Quarter)); // Beep once
  } else {
    // Stop any ongoing alert when a new message arrives
    stopAlert();

    // Display the incoming message
    basic.showString(incoming);

    // Start the alert process
    isAlerting = true;
    startAlerting();
  }
});

input.onButtonPressed(Button.A, function () {
  stopAlert(); // Stop alerting when Button A is pressed
  basic.clearScreen(); // Clear the display
});

input.onButtonPressed(Button.B, function () {
  stopAlert(); // Stop alerting when Button B is pressed
  basic.clearScreen(); // Clear the display
});

function startAlerting() {
  volume = 128; // Reset volume to the initial level
  music.setVolume(volume);

  // Beep immediately and then start the alert loop
  beepAndIncreaseVolume();

  // Use control.IntervalMode.Interval for repeated intervals
  alertInterval = control.setInterval(function () {
    beepAndIncreaseVolume();
  }, 10000, control.IntervalMode.Interval); // 10 seconds interval
}

function beepAndIncreaseVolume() {
  if (!isAlerting) return; // Exit if alerting was stopped

  music.playTone(262, music.beat(BeatFraction.Quarter)); // Beep
  if (volume < 255) { // Max volume is 255
    volume += 32; // Gradually increase volume
    music.setVolume(volume);
  }
}

function stopAlert() {
  if (isAlerting) {
    isAlerting = false;
    control.clearInterval(alertInterval, control.IntervalMode.Interval); // Clear the interval with mode
  }
}
