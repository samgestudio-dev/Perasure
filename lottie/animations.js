/* ---- Lottie registry --------------------------------------------------------------
   Shared by the picker (../index.html, "Lottie" tab) and the player (player.html).
   To add an animation: put its files in lottie/<slug>/ and add one entry below.

   slug     folder name = file name, lowercase-kebab-case
   title    sentence case, short
   desc     one line: what happens in the animation
   json     Lottie JSON played by the player (relative to lottie/<slug>/)
   lottie   optional .lottie (dotLottie) file offered as a download
   preview  still thumbnail shown on the picker (never an animation)
   intro    [start, end] frames, played once        } omit both for a one-shot
   loop     [start, end] frames, looped seamlessly  } animation (plays once, holds)
   success  coin-style two-part animation: `json` loops until "Show success",
            then this file plays once from the end of the current loop
   scale    optional, 0–1: size of the animation inside the stage (default 1)
*/
window.LOTTIES = [
  {
    slug: 'customer-service-chat',
    title: 'Customer service chat',
    desc: 'Phone slides in, a chat bubble floats out of the screen, typing dots and sparkles.',
    json: 'customer-service-chat.json', lottie: 'customer-service-chat.lottie', preview: 'preview.png',
    intro: [0, 36], loop: [36, 96]
  },
  {
    slug: 'customer-service',
    title: 'Customer service',
    desc: 'Icon enters, the service bubble pops and the typing dots appear.',
    json: 'customer-service.json', lottie: 'customer-service.lottie', preview: 'preview.png',
    intro: [0, 45], loop: [45, 105]
  },
  {
    slug: 'empty-box',
    title: 'Empty box',
    desc: 'Empty state: the open box enters and the light rays pop. Plays once and holds.',
    json: 'empty-box.json', lottie: 'empty-box.lottie', preview: 'preview.png'
  },
  {
    slug: 'loading-state-otp',
    title: 'Loading state OTP',
    desc: 'Sending the code: paper plane flies in on its trail, then stars and dots drift.',
    json: 'loading-state-otp.json', lottie: 'loading-state-otp.lottie', preview: 'preview.png',
    intro: [0, 36], loop: [36, 96]
  },
  {
    slug: 'safe-transaction',
    title: 'Safe transaction',
    desc: 'Person and phone enter, the bubble pops and the badge appears.',
    json: 'safe-transaction.json', lottie: 'safe-transaction.lottie', preview: 'preview.png',
    intro: [0, 54], loop: [54, 114]
  },
  {
    slug: 'verification-code',
    title: 'Verification code',
    desc: 'Code card and lock enter, tap mark and ripple, then the card floats.',
    json: 'verification-code.json', lottie: 'verification-code.lottie', preview: 'preview.png',
    intro: [0, 56], loop: [56, 116]
  },
  {
    slug: 'doc-verify',
    title: 'Doc verify',
    desc: 'Paper enters, the corner curls, lines write in and the pen lands.',
    json: 'doc-verify.json', lottie: 'doc-verify.lottie', preview: 'preview.png',
    intro: [0, 36], loop: [36, 96]
  },
  {
    slug: 'coins-loading',
    title: 'Coins loading → success',
    desc: 'Coin spins while loading; on success it finishes the turn, speeds up and lands on the tick.',
    json: 'loading-coin.json', success: 'success-coin.json', lottie: 'perasure-coins.lottie', preview: 'preview.png',
    scale: 0.5   // 112px canvas: shown at half the stage instead of filling it
  }
];
