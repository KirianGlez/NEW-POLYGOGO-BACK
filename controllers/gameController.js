const Game = require("../models/Game");
const Player = require("../models/Player");
const BoardGame = require('../models/BoardGame');  
const BoardInfoDefault = require('../models/BoardInfoDefault'); 


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
      
      const boardInfoDefaultData = await BoardInfoDefault.findOne({ title: "Fast Board" });
      
      game = new Game({ isActive: true, board: await crearNuevoBoardGame(boardInfoDefaultData) });
      await game.save();
    }

    // Crear un nuevo jugador asociado al usuario y a la partida encontrada o creada
    const player = new Player({ user: userId, game: game._id });
    await player.save();

    // Agregar al jugador a la partida
    game.players.push(player);
    await game.save();

    if (game.players.length === 4) {
      game.isInGame = true;
      const randomPlayerIndex = Math.floor(Math.random() * game.players.length);
      const selectedPlayer = game.players[randomPlayerIndex];

      game.turn = selectedPlayer;

      await game.save();
    }

    res.json({ game, player });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al buscar partida", error });
  }
};

async function crearNuevoBoardGame(boardInfoDefaultData) {
  // Crear un nuevo tablero de juego con datos de BoardInfoDefault
  
  const nuevoBoardGame = new BoardGame({
    title: boardInfoDefaultData.title,
    // Otras propiedades del tablero de juego
    boxes: boardInfoDefaultData.boxes.map(box => ({ ...box, player_owner: undefined }))
  });
  // Guardar el nuevo tablero de juego en la base de datos
  await nuevoBoardGame.save();
  return nuevoBoardGame._id;
}

exports.checkGameInGame = async (req, res) => {
  try {
    const userId = req.user.userId; // Asumiendo que el ID del usuario está en el token

    // Verificar si el usuario ya está en una partida activa que esté en juego
    const players = await Player.find({ user: userId }).populate("game").exec();
    const player = players.find((player) => {
      return player.game && player.game.isActive && player.game.isInGame;
    });
    if (player) {
      // Si el usuario ya está en una partida activa que está en juego
      const game = await Game.findById(player.game._id)
      .populate({
        path: "players",
        populate: {
          path: "user",
          select: "username"
        }
      })
      .populate("board");
      if (res) {
        res.json({ game, player });
      } else {
        return { game, player };
      }

      return;
    }

    res.json({
      message: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al buscar partida", error });
  }
};

exports.rollDice = async (req, res) => {
  try {
    const userId = req.user.userId; // Asumiendo que el ID del usuario está en el token

    const game = await this.checkGameInGame(req);
    if ((game.game.turn.user = userId && !game.player.playing)) {
      const dice = Math.floor(Math.random() * 6) + 1;
      game.player.dice = dice;

      if (game.player.position >= 21) {
        game.player.position = game.player.position + dice;
        game.player.position = game.player.position - 21;
      } else {
        game.player.position = game.player.position + dice;
      }
      game.player.playing = true;
      game.player.save();
    }

    res.json({
      message: game.player,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar partida", error });
  }
};

exports.nextTurn = async (req, res) => {
  try {
    const userId = req.user.userId; // Asumiendo que el ID del usuario está en el token

    const game = await this.checkGameInGame(req);
    if ((game.game.turn.user = userId && game.player.playing)) {
      game.player.playing = false;
      const index = game.game.players.findIndex((player) => {
        return player.user._id.toString() === game.player.user.toString();
      });
      if (index == 3) {
        game.game.turn = game.game.players[0];
      } else {
        game.game.turn = game.game.players[index + 1];
      }
    }
    game.game.save();
    game.player.save();

    res.json({
      message: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar partida", error });
  }
};