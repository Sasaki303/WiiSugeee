const { exec } = require("child_process");

exports.clap = () => {
  exec(
    "powershell -c (New-Object Media.SoundPlayer 'C:\\\\Windows\\\\Media\\\\tada.wav').Play()"
  );
};

exports.sparkle = () => {
  exec(
    "powershell -c (New-Object Media.SoundPlayer 'C:\\\\Windows\\\\Media\\\\notify.wav').Play()"
  );
};
