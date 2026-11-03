import test from "node:test";
import assert from "node:assert/strict";

const allowedTiles = new Set(["", "player", "platform", "coin", "tree", "enemy", "goal"]);
const validGame = {
  title: "Test Nexus",
  description: "Niveau de test",
  genre: "Plateforme",
  tiles: Array.from({ length: 70 }, (_, index) => index === 0 ? "player" : index === 69 ? "goal" : "")
};
function isValidNexusFile(value) {
  if (!value || typeof value !== "object") return false;
  if (value.format !== "nexus-games-creation" || value.version !== 1) return false;
  const game = value.game;
  if (!game || typeof game !== "object") return false;
  if (typeof game.title !== "string" || !game.title.trim() || game.title.length > 40) return false;
  if (typeof game.description !== "string" || game.description.length > 180) return false;
  if (typeof game.genre !== "string" || game.genre.length > 30) return false;
  if (!Array.isArray(game.tiles) || game.tiles.length !== 70) return false;
  return game.tiles.every(tile => allowedTiles.has(tile));
}

test("accepts a valid Nexus Games creation", () => {
  assert.equal(isValidNexusFile({ format: "nexus-games-creation", version: 1, game: validGame }), true);
});
test("rejects an unknown format or version", () => {
  assert.equal(isValidNexusFile({ format: "other", version: 1, game: validGame }), false);
  assert.equal(isValidNexusFile({ format: "nexus-games-creation", version: 99, game: validGame }), false);
});
test("rejects a board with the wrong number of tiles", () => {
  assert.equal(isValidNexusFile({ format: "nexus-games-creation", version: 1, game: { ...validGame, tiles: ["player"] } }), false);
});
test("rejects unsupported tile values", () => {
  const tiles = [...validGame.tiles];
  tiles[4] = "script";
  assert.equal(isValidNexusFile({ format: "nexus-games-creation", version: 1, game: { ...validGame, tiles } }), false);
});
test("rejects invalid or oversized metadata", () => {
  assert.equal(isValidNexusFile({ format: "nexus-games-creation", version: 1, game: { ...validGame, title: " " } }), false);
  assert.equal(isValidNexusFile({ format: "nexus-games-creation", version: 1, game: { ...validGame, title: "x".repeat(41) } }), false);
});
