# Nexus Emergency City — Game Design Document

## Vision
A large original European-inspired metropolis for a grounded emergency-services and civilian-life simulation. The experience targets desktop first, with browser delivery as a progressive target. The world, vehicles, lighting, sound and interactions must be developed to a quality bar well above a simple Roblox-style prototype.

## Locked creative decisions
- Setting: original, large metropolitan city; not a copy of Hamburg or any existing map.
- Camera: first-person and third-person.
- Primary quality target: high visual fidelity.
- Inspiration: the broad role-play loop of emergency-services city simulators; all map layouts, names, missions, art and code must be original.

## Core roles
- Police: patrol, traffic management, dispatch and investigation missions.
- Fire & rescue: incident response, rescue and fire-safety missions.
- Medical services: ambulance response and patient transport.
- Civilian: jobs, driving, housing, exploration and everyday city activities.

## Technical direction
- Web platform: Next.js + TypeScript.
- 3D runtime: Babylon.js.
- Initial target: desktop browser prototype; evaluate performance before promising mobile support.
- Future PC packaging: desktop shell only after the web runtime and controls are stable.
- Assets: original or properly licensed PBR models, textures, animations and audio. Do not use ripped Roblox assets or copyrighted Emergency Hamburg assets.

## Visual quality bar
- Physically based materials (PBR), coherent scale, high-quality lighting and shadows.
- Wet/dry road material variants, believable glass/concrete/metal, atmospheric depth and time-of-day lighting.
- Detailed original vehicles, interiors, road markings, signage, props and human animation.
- Scalable quality settings so the browser build remains usable on different PCs.

## Milestones
### 0.1 — City technology preview
- Babylon.js runtime loads in a dedicated route.
- Procedural blockout demonstrates scale, streets, camera modes and movement.
- Clearly label placeholder geometry as a blockout; it is not the final visual quality.
### 0.2 — Metropolitan blockout (implemented)
- 5 × 5 urban blocks arranged around a six-by-six avenue grid.
- Distinct downtown, business, residential, industrial and civic building profiles.
- Sidewalks, curbs, lane markings, zebra crossings and boulevard lighting.
- Two green public spaces, a waterfront canal and promenades.
- Central civic / transit landmark and expanded walkable bounds.
- Development-project spotlight and direct prototype route from the Nexus Games homepage.
### 0.3 — Vehicle foundation
- One original civilian vehicle, then emergency vehicle variants; driving physics and camera.
### 0.3 — Vehicle foundation (implemented prototype)
- Added an original procedural civilian hatchback with body, cabin glazing, headlights, tail lights, tires and alloy wheels.
- Added an enter/exit driving toggle and keyboard throttle, reverse, steering and rolling wheel animation.
- Third-person follow camera and first-person in-car camera are supported.
- Driving remains an early arcade prototype: no suspension simulation, traffic AI, damage system, detailed interior or final vehicle asset yet.

### 0.4 — Emergency services and first missions (implemented prototype)
- Added a dispatch panel with three selectable, non-graphic tasks: police traffic coordination, fire-safety prevention check and citizen assistance.
- Each task has a destination coordinate; walking or driving within 9 metres completes the intervention.
- Added a completed-intervention counter and feedback toast.
- These are navigation and interaction prototypes, not full emergency-service simulations; no injury, fire-fighting or tactical mechanics are implemented.
### 0.5 — Emergency fleet and living-city prototype (implemented)
- Added original procedural police cruiser, fire engine and ambulance models, parked at the civic hub.
- Added eight lightweight pedestrian placeholders with simple sidewalk-loop movement.
- Added three ambient civilian traffic vehicles following bounded loops on the main avenue.
- Updated the in-game dispatch/HUD build label and Nexus Games catalogue to 0.5.
- These are low-cost procedural prototypes: no siren audio, emergency light animation, pedestrian navigation mesh, traffic signals, collision avoidance, advanced road rules or multiplayer yet.

### Future — Multiplayer prototype
- Authoritative server, player sessions, synchronization and abuse prevention.
### 1.0 — Public release candidate
- Performance, accessibility, QA, privacy and security review; only then publish on Nexus Games.

## Current limitations
The 0.2 scene is still a technical greybox. It does not yet contain finished art assets, vehicles, NPCs, missions, multiplayer, or production-quality graphics. The city layout is procedural and intended to validate scale and navigation, not represent the final art direction. The empty Nexus Games catalogue remains unchanged until a real release candidate is tested.
