import Brands from "./Brands.js";
import Connections from "./Connections.js";
import Connections_Groups from "./Connections_Groups.js";
import Connections_Groups_Results from "./Connections_Groups_Results.js";
import Drivers from "./Drivers.js";
import GuessCareers from "./GuessCareers.js";
import GuessCareers_Teams from "./GuessCareers_Teams.js";
import GuessDrivers from "./GuessDrivers.js";
import GuessDrivers_Teams from "./GuessDrivers_Teams.js";
import GuessPodiums from "./GuessPodiums.js";
import GuessTeams from "./GuessTeams.js";
import H2HGames from "./H2HGames.js";
import Impostors from "./Impostors.js";
import Impostors_Results from "./Impostors_Results.js";
import Season_Teams from "./Season_Teams.js";
import Season_Teams_Drivers from "./Season_Teams_Drivers.js"; // Importa la nueva tabla
import Seasons from "./Seasons.js";
import Season_Tracks from "./Seasons_Tracks.js";
import Teams from "./Teams.js";
import Timeline from "./Timeline.js";
import TimelineEvent from "./TimelineEvent.js";
import Tracks from "./Tracks.js";

// --- Asociaciones de muchos a muchos ---

// Asociación entre Seasons y Teams (a través de la tabla Season_Teams)
Seasons.hasMany(Season_Teams, { foreignKey: "seasonID" });
Season_Teams.belongsTo(Seasons, {
  foreignKey: "seasonID",
  targetKey: "id",
});

Teams.hasMany(Season_Teams, { foreignKey: "teamID" });
Season_Teams.belongsTo(Teams, {
  foreignKey: "teamID",
  targetKey: "id",
});

// Asociación entre Seasons y Tracks (a través de la tabla Season_Tracks)
Seasons.hasMany(Season_Tracks, { foreignKey: "seasonID" });
Season_Tracks.belongsTo(Seasons, {
  foreignKey: "seasonID",
  targetKey: "id",
});

Tracks.hasMany(Season_Tracks, { foreignKey: "trackID" });
Season_Tracks.belongsTo(Tracks, {
  foreignKey: "trackID",
  targetKey: "id",
});

// --- Asociaciones para la nueva tabla Season_Teams_Drivers ---

// Asociación entre Seasons y Season_Teams_Drivers
Seasons.hasMany(Season_Teams_Drivers, { foreignKey: "seasonID" });
Season_Teams_Drivers.belongsTo(Seasons, {
  foreignKey: "seasonID",
  targetKey: "id",
});

// Asociación entre Teams y Season_Teams_Drivers
Teams.hasMany(Season_Teams_Drivers, { foreignKey: "teamID" });
Season_Teams_Drivers.belongsTo(Teams, {
  foreignKey: "teamID",
  targetKey: "id",
});

// Asociación entre Drivers y Season_Teams_Drivers
Drivers.hasMany(Season_Teams_Drivers, { foreignKey: "driverID" });
Season_Teams_Drivers.belongsTo(Drivers, {
  foreignKey: "driverID",
  targetKey: "id",
});

// Asociación entre Impostors y Impostors_Results
Impostors.hasMany(Impostors_Results, { foreignKey: "gameID" });
Impostors_Results.belongsTo(Impostors, {
  foreignKey: "gameID",
  targetKey: "id",
});

// --- Asociación: Connections → Connections_Groups (1:N)
Connections.hasMany(Connections_Groups, { foreignKey: "gameID" });
Connections_Groups.belongsTo(Connections, {
  foreignKey: "gameID",
  targetKey: "id",
});

// --- Asociación: Connections_Groups → Connections_Groups_Results (1:N)
Connections_Groups.hasMany(Connections_Groups_Results, {
  foreignKey: "groupID",
});
Connections_Groups_Results.belongsTo(Connections_Groups, {
  foreignKey: "groupID",
  targetKey: "id",
});

Teams.hasMany(GuessTeams, { foreignKey: "team_id" });
Drivers.hasMany(GuessTeams, { foreignKey: "driver1_id", as: "GuessDriver1" });
Drivers.hasMany(GuessTeams, { foreignKey: "driver2_id", as: "GuessDriver2" });
Seasons.hasMany(GuessTeams, { foreignKey: "season_id" });

GuessTeams.belongsTo(Teams, { foreignKey: "team_id" });
GuessTeams.belongsTo(Drivers, { foreignKey: "driver1_id", as: "Driver1" });
GuessTeams.belongsTo(Drivers, { foreignKey: "driver2_id", as: "Driver2" });
GuessTeams.belongsTo(Seasons, { foreignKey: "season_id" });

// Asociaciones para H2HGames
Teams.hasMany(H2HGames, { foreignKey: "team_id" });
Drivers.hasMany(H2HGames, { foreignKey: "driver1_id", as: "H2HDriver1" });
Drivers.hasMany(H2HGames, { foreignKey: "driver2_id", as: "H2HDriver2" });

H2HGames.belongsTo(Teams, { foreignKey: "team_id" });
H2HGames.belongsTo(Drivers, { foreignKey: "driver1_id", as: "Driver1" });
H2HGames.belongsTo(Drivers, { foreignKey: "driver2_id", as: "Driver2" });

// Asociaciones para GuessCareers
Drivers.hasMany(GuessCareers, { foreignKey: "driver_id" });
GuessCareers.belongsTo(Drivers, { foreignKey: "driver_id" });

// Asociaciones para GuessCareers_Teams
GuessCareers.hasMany(GuessCareers_Teams, { foreignKey: "game_id" });
GuessCareers_Teams.belongsTo(GuessCareers, {
  foreignKey: "game_id",
  targetKey: "id",
});

Teams.hasMany(GuessCareers_Teams, { foreignKey: "team_id" });
GuessCareers_Teams.belongsTo(Teams, {
  foreignKey: "team_id",
  targetKey: "id",
});

// Asociaciones para GuessDrivers
Drivers.hasMany(GuessDrivers, { foreignKey: "driver_id" });
GuessDrivers.belongsTo(Drivers, { foreignKey: "driver_id" });

// Asociaciones para GuessDrivers_Teams
GuessDrivers.hasMany(GuessDrivers_Teams, { foreignKey: "game_id" });
GuessDrivers_Teams.belongsTo(GuessDrivers, {
  foreignKey: "game_id",
  targetKey: "id",
});

Teams.hasMany(GuessDrivers_Teams, { foreignKey: "team_id" });
GuessDrivers_Teams.belongsTo(Teams, {
  foreignKey: "team_id",
  targetKey: "id",
});

Timeline.hasMany(TimelineEvent, {
  foreignKey: "gameID",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

TimelineEvent.belongsTo(Timeline, {
  foreignKey: "gameID",
  targetKey: "id",
});

// --- Asociaciones para GuessPodiums ---
// Un piloto puede estar en múltiples juegos de podio (1era, 2da o 3era posición)
Drivers.hasMany(GuessPodiums, {
  foreignKey: "first_place_driver_id",
  as: "PodiumFirst",
});
Drivers.hasMany(GuessPodiums, {
  foreignKey: "second_place_driver_id",
  as: "PodiumSecond",
});
Drivers.hasMany(GuessPodiums, {
  foreignKey: "third_place_driver_id",
  as: "PodiumThird",
});

// Una marca puede estar en múltiples juegos de podio (1era, 2da o 3era posición)
Brands.hasMany(GuessPodiums, {
  foreignKey: "first_place_car_id",
  as: "CarFirst",
});
Brands.hasMany(GuessPodiums, {
  foreignKey: "second_place_car_id",
  as: "CarSecond",
});
Brands.hasMany(GuessPodiums, {
  foreignKey: "third_place_car_id",
  as: "CarThird",
});

// Un juego de podio pertenece a pilotos específicos
GuessPodiums.belongsTo(Drivers, {
  foreignKey: "first_place_driver_id",
  as: "FirstDriver",
});
GuessPodiums.belongsTo(Drivers, {
  foreignKey: "second_place_driver_id",
  as: "SecondDriver",
});
GuessPodiums.belongsTo(Drivers, {
  foreignKey: "third_place_driver_id",
  as: "ThirdDriver",
});

// Un juego de podio pertenece a marcas específicas
GuessPodiums.belongsTo(Brands, {
  foreignKey: "first_place_car_id",
  as: "FirstCar",
});
GuessPodiums.belongsTo(Brands, {
  foreignKey: "second_place_car_id",
  as: "SecondCar",
});
GuessPodiums.belongsTo(Brands, {
  foreignKey: "third_place_car_id",
  as: "ThirdCar",
});

export {
  Brands,
  Connections,
  Connections_Groups,
  Connections_Groups_Results,
  Drivers,
  GuessCareers,
  GuessCareers_Teams,
  GuessDrivers,
  GuessDrivers_Teams,
  GuessPodiums,
  GuessTeams,
  H2HGames,
  Impostors,
  Impostors_Results,
  Season_Teams,
  Season_Teams_Drivers,
  Season_Tracks,
  Seasons,
  Teams,
  Timeline,
  TimelineEvent,
  Tracks,
};
