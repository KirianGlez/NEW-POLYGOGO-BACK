const Game = require("../models/Game");
const Player = require("../models/Player");

exports.search = async (req, res) => {
  try {
    const userId = req.user.userId; // Asumiendo que el ID del usuario está en el token

    // Verificar si el usuario ya está en una partida activa
    const players = await Player.find({ user: userId }).populate("game").exec();

    const activeGames = players.filter((player) => {
      return player.game && player.game.isActive;
    });

    if (activeGames.length == 1) {
      // Si el usuario ya está en una partida activa que no está en juego
      res.json({ activeGames: activeGames });
      return;
    }

    // Buscar partidas que cumplan con los criterios
    const games = await Game.find({
      isActive: true,
      isInGame: false,
    })
      .populate("players")
      .exec();

    // Filtrar las partidas que tienen menos de 4 jugadores
    const filteredGames = games.filter((game) => game.players.length < 4);

    let game;

    if (filteredGames.length > 0) {
      // Si se encontraron partidas que cumplen con los criterios y tienen menos de 4 jugadores
      game = filteredGames[0]; // Tomar la primera partida encontrada
    } else {
      // Si no se encontraron partidas que cumplan con los criterios o tienen 4 jugadores
      // Crear una nueva partida
      game = new Game({ isActive: true });
      await game.save();
    }

    // Crear un nuevo jugador asociado al usuario y a la partida encontrada o creada
    const player = new Player({ user: userId, game: game._id });
    await player.save();

    // Agregar al jugador a la partida
    game.players.push(player);
    await game.save();

    res.json({ game, player });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar partida", error });
  }
};
