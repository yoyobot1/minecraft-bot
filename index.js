const mineflayer = require('mineflayer');
const Vec3 = require('vec3');

const botOptions = {
  host: 'crafty-yoyobot.duckdns.org',
  port: 25565,
  username: 'Bot-creeper'
};

let targetPlayerName = null;

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.once('spawn', () => {
    bot.creative.startFlying();
    console.log('✅ Bot spawné:', bot.entity.position);

    setInterval(() => {
      console.log('👥 Joueurs:', Object.keys(bot.players).join(', ') || 'aucun');
    }, 5000);

    function goToPlayer(playerName) {
      console.log('🎯 Vol vers:', playerName);
      
      // ✅ MÉTHODE 1: Commande serveur TP (LE PLUS FIABLE)
      bot.chat(`/tp @s ${playerName}`);
    }

    function processCommand(username, message) {
      const cleanMsg = message.toLowerCase().replace(/\[.*?\]|<.+?>|:|→|server whispers to you|server murmure/g, '').trim();

      if (message.includes('whispers') && cleanMsg.includes('vas chez')) {
        const match = message.match(/vas\s+chez\s+([a-zA-Z0-9]+)/i);
        targetPlayerName = match ? match[1] : 'LucasTrompette';
        
        console.log('🎯 Commande:', targetPlayerName);
        
        // TP en hauteur d'abord
        bot.chat('/tp @s ~ 120 ~');
        setTimeout(() => goToPlayer(targetPlayerName), 1500);
      }
    }

    // Capture TOUS messages
    bot.on('chat', (username, message) => {
      console.log(`💬 "${username}": "${message}"`);
      processCommand(username, message);
    });

    bot.on('message', (jsonMsg) => {
      const msgStr = jsonMsg.toString();
      console.log(`📨 "${msgStr}"`);
      processCommand('?', msgStr);
    });

    bot.on('messagestr', (message) => {
      console.log(`📝 "${message}"`);
      processCommand('?', message);
    });
  });

  bot.on('end', () => { console.log('❌ Reconnexion...'); setTimeout(createBot, 5000); });
  bot.on('error', console.error);
}

createBot();
