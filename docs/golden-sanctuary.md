# Golden Sanctuary forest

Implementation notes for the Golden Sanctuary homepage forest.

The homepage still uses a real scroll-driven 3D path, not a zoomed background image. The selected concept is used only as a static/loading fallback. Centred captions, dark introduction and plain clearing remain unchanged.

## Assets

Generated with the built-in image-generation tool, then resized and encoded as WebP for delivery. Original outputs remain in the image-generation library. Foliage alpha is preserved.

- `public/images/woodland/golden-bark.webp` — colour and bump texture.
- `public/images/woodland/golden-ground.webp` — path/forest-floor texture.
- `public/images/woodland/golden-leaves.webp` — transparent canopy and shrub cards.
- `public/images/woodland/golden-sanctuary-fallback.webp` — selected concept, static fallback only.

## Runtime

Vegetation uses instanced meshes. Static shadow maps update after placement rather than every frame. Pollen animates only while the forest is in view, the page is visible and the user has not requested reduced motion. It stops behind the opaque opening and ending surfaces.

Trees use four distinct deformed trunk meshes with bark-texture-driven physical relief, fluted bases and knots. Branches bend and taper; doorway roots taper into the ground. The large tree's hollow is asymmetric, and its subdivided surface has geometric bark relief rather than remaining a smooth extrusion. Geometry checks cover finite vertices/normals, distinct trunk forms and an unobstructed ray through the hollow at camera height.

These are lightweight browser materials, not a claim of matching the concept image's offline-rendered fidelity. Further bespoke modelling may be useful after design review.

## Generation prompts

### golden-bark

Use case: stylized-concept. Asset type: seamless square colour texture for a realistic 3D ancient oak trunk in a golden elven woodland. Orthographic straight-on macro surface scan, frame completely filled with richly detailed vertical oak bark ridges, deep irregular fissures, restrained olive lichen and tiny moss in some crevices, natural warm brown-grey timber. Flat diffuse neutral illumination so lighting can be added in 3D. Uniform detail density, no recognizable focal patch, designed to tile on all edges. No actual tree silhouette, ground, sky, text, border, perspective or cast shadow. Photographic natural material, not illustration.

### golden-ground

Use case: stylized-concept. Asset type: seamless square ground colour texture for a realistic 3D woodland footpath. Orthographic straight-down material scan filling the whole frame: compact warm brown earth, tiny grey-tan pebbles, scattered very small weathered oak leaf fragments, delicate fine root strands, subtle dark damp variations. Fine believable detail, not a scene or a path seen in perspective. Flat neutral diffuse lighting, no dramatic shadows, no large recognizable stones, no grass or plants, no vignette, no text, border or watermark. Tileable edges and evenly distributed detail for realtime 3D use.

### golden-leaves

Use case: photorealistic-natural. Asset type: transparent botanical cutout texture for 3D forest foliage cards. One broad airy naturally irregular oak branch cluster with many individually distinct green oak leaves, leaf veins, a few warm yellow-green edges, organic overlapping leaves and slender brown twig branching. Front view, botanical photography realism, soft neutral diffuse lighting. Leaves occupy a roughly oval horizontal cluster across the frame with many transparent gaps between them and a fully transparent background all around. No pot, floor, landscape, sky, border, text, watermark or baked rectangular background. Preserve crisp delicate serrated leaf edges and genuine alpha transparency.

### Selected concept / fallback

Use case: stylized-concept. Asset type: preview-only art-direction image for Arbor's scroll-driven first-person forest website. Wide landscape cinematic composition, eye-level on a gently winding walkable earthen path leading through an enormous ancient living tree's naturally arched hollow doorway into a clearing. Premium believable natural materials: deeply fissured bark with lichen and moss, irregular root systems, delicate fern fronds, fine individual grasses, layered shrubs, complex natural leaf silhouettes. Magical but physically grounded, elven and heavenly rather than cartoon fantasy. Restrained floating pollen/firefly motes in the air, subtle atmospheric depth and soft volumetric shafts. Keep the middle of the composition quiet enough for future centred website typography, but DO NOT render any text or interface. No people, buildings, fantasy characters, glowing runes, logos, watermarks, plastic low-poly shapes or oversaturated neon. This is one cohesive scene, not a collage. Direction A: GOLDEN SANCTUARY. A welcoming mythical old-growth forest at luminous early morning. Deep emerald and olive foliage with warm honey light spilling through the tree doorway. Damp textured moss, lush believable ferns, delicate sunlit leaf edges. Soft gold pollen catches the rays, gentle mist rests close to the ground. Beautiful high-end environment render with photographic realism, peaceful, sacred, alive. Show the massive hollow tree at a medium distance, framing the bright path ahead.
