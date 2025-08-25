using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.AI;

// NOTE: This file is a standalone helper. Move it into your Unity project's Assets/Scripts folder
// (or the equivalent) so the Unity compiler picks it up. It expects a `Stair` component with a
// `Transform destination` field (adjust the property names if your Stair API differs).

namespace UnityHelpers
{
    public static class MultiFloorGeneratorExtensions
    {
        private static readonly Regex StairRegex = new Regex(@"Stair[_\-](\d+)[_\-](\d+)[_\-]f(\d+)", RegexOptions.Compiled);

        /// <summary>
        /// Finds stairs under <paramref name="root"/>, links them to vertical partners by parsing names
        /// matching the pattern "Stair_x_y_fZ", marks the player GameObject as persistent, and rebuilds
        /// any found NavMeshSurface components.
        /// Returns the player GameObject that was made persistent (either the passed one or the GameObject found with tag "Player").
        /// </summary>
        /// <param name="root">Root GameObject containing generated floors and stairs.</param>
        /// <param name="playerInstance">Optional reference to the player GameObject you've instantiated. If null, the method will search GameObject.FindWithTag("Player").</param>
        /// <returns>Persistent player GameObject or null if none found.</returns>
        public static GameObject LinkStairsAndFinalize(GameObject root, GameObject playerInstance = null)
        {
            if (root == null)
            {
                Debug.LogWarning("LinkStairsAndFinalize called with null root");
                return playerInstance;
            }

            // collect Stair components (assumes a Stair MonoBehaviour exists in the project)
            var stairs = new List<Stair>(root.GetComponentsInChildren<Stair>(true));
            var map = new Dictionary<(int x, int y, int f), Stair>();

            foreach (var s in stairs)
            {
                if (s == null || s.gameObject == null) continue;
                var m = StairRegex.Match(s.gameObject.name);
                if (!m.Success) continue;

                if (!int.TryParse(m.Groups[1].Value, out var x)) continue;
                if (!int.TryParse(m.Groups[2].Value, out var y)) continue;
                if (!int.TryParse(m.Groups[3].Value, out var f)) continue;

                map[(x, y, f)] = s;
            }

            // pair stairs vertically (f <-> f+1) and link both directions
            foreach (var kv in new List<KeyValuePair<(int x, int y, int f), Stair>>(map))
            {
                var key = kv.Key;
                var stair = kv.Value;
                var aboveKey = (key.x, key.y, key.f + 1);
                if (map.TryGetValue(aboveKey, out var aboveStair))
                {
                    try
                    {
                        stair.destination = aboveStair.transform;
                        aboveStair.destination = stair.transform;
                    }
                    catch (Exception ex)
                    {
                        Debug.LogWarning($"Failed to link stair pair {stair.name} <-> {aboveStair.name}: {ex.Message}");
                    }
                }
            }

            // Make player persistent: prefer passed-in reference, otherwise find by tag
            if (playerInstance == null)
            {
                try
                {
                    var found = GameObject.FindWithTag("Player");
                    if (found != null)
                    {
                        GameObject.DontDestroyOnLoad(found);
                        playerInstance = found;
                    }
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"Exception while finding player by tag: {ex.Message}");
                }
            }
            else
            {
                try { GameObject.DontDestroyOnLoad(playerInstance); } catch (Exception ex) { Debug.LogWarning($"DontDestroyOnLoad failed: {ex.Message}"); }
            }

            // Rebuild NavMesh surfaces under the generated root (if any). This uses NavMeshSurface from the NavMeshComponents package
            var surfaces = root.GetComponentsInChildren<NavMeshSurface>(true);
            foreach (var s in surfaces)
            {
                if (s == null) continue;
                try
                {
                    s.BuildNavMesh();
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"NavMeshSurface.BuildNavMesh failed for {s.name}: {ex.Message}");
                }
            }

            return playerInstance;
        }
    }
}
