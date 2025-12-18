export function videoGenerationPrompt(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director and scriptwriter creating detailed video blueprints for AI-generated videos.

## Your Task
Generate a complete video blueprint in JSON format based on the user's prompt and specifications. This blueprint will guide the creation of a video with multiple scenes and camera angles.

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## Understanding the Workflow
Your blueprint will be used in this process:
1. Character images will be generated from character descriptions for consistency
2. Main scene images will be generated from scene imagePrompts + character reference images
3. Videos will be created by animating these images using the videoPrompt (camera motion and movements) + character reference images
4. Angle images will be generated using the main scene as a reference + angleVideoPrompt
5. Angle videos will be animated with their specific camera movements
6. All clips will be edited together to create the final video

**IMPORTANT**: Character reference images will be automatically provided to the image/video generation models based on the charactersInTheScene array. Your prompts should reference characters naturally without needing to fully re-describe them.

## Output Requirements

### 1. Title
Generate a compelling, concise title (3-8 words) that captures the video's essence.

### 2. Characters
Identify all main characters/subjects in the story. For EACH character, provide:
- **name**: Character identifier (e.g., "Hero", "Villain", "Product", "Narrator", "Main Character", "Dragon", "Spaceship")
  - Use clear, consistent names that will be referenced in charactersInTheScene arrays
  - Names should be descriptive and unique
- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words) for generating a consistent character reference image. Must include:
  - Physical appearance (age, gender, build, height if applicable)
  - Facial features and distinctive characteristics
  - Hair/head details (color, style, length)
  - Clothing/outfit (specific items, colors, style)
  - Accessories or props associated with the character
  - Overall aesthetic and personality conveyed through appearance
  - Exact style matching "${style}"

**CRITICAL**: This description will be used to generate a reference image that must remain consistent across ALL scenes. The reference image will be automatically provided when this character appears in a scene.

Example for anime style: "A teenage female protagonist with large expressive violet eyes, long flowing silver hair with twin braids, wearing a futuristic white and blue combat suit with glowing cyan accents, confident determined expression, athletic build, anime style with cel-shading and vibrant colors"

### 3. Scenes
Break down the story into ${Math.ceil(durationInSecs / 10)} to ${Math.ceil(durationInSecs / 7)} scenes based on the ${durationInSecs} second duration.

Each scene represents a KEY MOMENT, LOCATION CHANGE, or SIGNIFICANT STORY BEAT.

For each scene, provide:

- **index**: Scene number (starting from 0)

- **charactersInTheScene**: Array of character names that appear in this scene
  - Use EXACT character names as defined in the Characters section
  - List all characters visible in the scene
  - Order doesn't matter, but be accurate
  - Can be empty array [] if no defined characters appear (e.g., pure landscape shots)
  - Examples: ["Hero"], ["Hero", "Villain"], ["Dragon", "Knight"], []

- **narration**: (OPTIONAL string) Voice-over narration for this scene (10-15 words)
  - Should complement the visual storytelling, not just describe what's shown
  - Can provide context, inner thoughts, story progression, or atmosphere
  - Keep concise and impactful - narration should enhance, not overwhelm
  - Use empty string "" if no narration is needed for this scene
  - Consider pacing: narration should fit naturally within the scene duration

- **imagePrompt**: EXTREMELY DETAILED description (100-200 words) for the main establishing shot. Must include:
  - **Camera angle/shot type**: (e.g., "wide shot", "close-up", "medium shot", "aerial view", "low angle", "high angle", "over-the-shoulder")
  - **Setting/Location**: Detailed environment description
  - **Character positions and actions**: Where each character from charactersInTheScene is positioned and what they're doing (you can reference them by name since their reference images will be provided)
  - **Action/Moment**: What's happening in this frozen frame
  - **Lighting**: Light sources, mood, atmosphere
  - **Visual details**: Colors, textures, atmospheric elements
  - **Composition**: Foreground, midground, background elements (composed for ${aspectRatio} aspect ratio)
  - **Style**: Must match "${style}" exactly

**IMPORTANT**: 
- This will be turned into a static image first, then animated. Describe it as a freeze-frame.
- Characters listed in charactersInTheScene will have their reference images automatically provided, so you can reference them naturally (e.g., "the Hero stands in the foreground") without fully re-describing their appearance.
- Focus on positioning, actions, and scene context rather than re-describing character appearances.

- **videoPrompt**: Detailed description (80-150 words) for animating the main scene image. Must include:
  - **Camera movements**: Specific camera motion (e.g., "camera slowly pans right", "smooth dolly push forward", "gentle zoom in", "camera tilts up", "orbital camera movement clockwise", "static camera with no movement")
  - **Character movements**: What each character does (keep natural and appropriate: "Hero turns head slightly toward Villain", "Villain's cape billows in wind", "Dragon's chest expands with breathing")
  - **Environmental motion**: Any atmospheric or environmental animation (e.g., "leaves rustle gently", "water ripples", "fog drifts slowly", "light particles float")
  - **Motion intensity**: Should be subtle and cinematic, avoiding jarring or excessive movements
  - **Duration context**: Movements should be paced for a 5-10 second clip

**CRITICAL**: 
- The videoPrompt animates the static image created from imagePrompt. Focus on what MOVES, not what exists.
- Character reference images will be provided during video generation for consistency.

- **angles**: (OPTIONAL array) Additional camera perspectives of the SAME scene/moment
  
  When to include angles:
  - When close-ups reveal important details or emotions
  - When different perspectives add visual interest or clarity
  - When showing the same moment from multiple views creates better flow
  - For action or key moments that benefit from varied viewpoints
  - **Typically 1-3 angles per important scene, NOT every scene needs angles**
  
  Each angle object contains:
  - **index**: Angle number within this scene (starting from 0)
  - **angleVideoPrompt**: Detailed description (80-150 words) of the alternative angle WITH animation. Must include:
    - How the camera angle differs from the main shot
    - What specific detail or aspect this angle emphasizes
    - Camera movement description (e.g., "camera slowly pans left", "camera pushes forward", "smooth zoom in", "camera orbits around subject")
    - Character/subject movements if any (keep subtle: "slight movements", "gentle gestures", "minimal natural motion")

**CRITICAL**: Angle prompts will use the main scene image as a reference (with character images), so focus on what's DIFFERENT about the angle and how it moves.

## Critical Guidelines

1. **Character Tracking**: Accurately track which characters appear in each scene using charactersInTheScene
2. **Character Consistency**: Use exact character names from the Characters section in charactersInTheScene arrays
3. **Visual Clarity**: Every imagePrompt should create a clear mental image that AI can accurately generate
4. **Motion Clarity**: Every videoPrompt should describe realistic, achievable animations appropriate for the style
5. **Character References**: Remember that character reference images will be provided automatically - focus on positioning and actions rather than re-describing appearance
6. **Appropriate Animation**: Consider what movements are natural for the style (subtle for realistic, more dynamic for animated)
7. **Camera Language**: Use professional cinematography terms appropriate for the style
8. **Atmospheric Details**: Include lighting, mood, and environmental details in imagePrompts
9. **Motion Pacing**: Keep movements smooth and cinematic; avoid rapid or jerky motions
10. **Location Logic**: Maintain consistent environmental details when scenes share locations
11. **Story Flow**: Scenes should progress logically and tell a coherent narrative
12. **Angle Purpose**: Each angle should add value - better detail, emotional impact, or visual variety
13. **Narration Purpose**: Include narration to add meaningful story context, emotional depth, or transitions between scenes

## Animation Guidelines for videoPrompt:
- **Camera movements should be smooth and professional** (dolly, pan, tilt, zoom, orbit, or static)
- **Character movements should be subtle and natural** unless the style or action demands otherwise
- **Environmental effects should enhance mood** without overwhelming the scene
- **Timing should feel cinematic** - nothing should move too fast or feel rushed
- **Consider the style**: realistic styles need more subtle motion, animated styles can be more expressive
- **Character reference images will be provided** during video generation for visual consistency

## Style-Specific Considerations for "${style}":
${getStyleGuidelines(style)}

## JSON Output Structure

Output ONLY valid JSON with NO additional text or explanations:

{
  "title": "string",
  "characters": [
    {
      "name": "string (clear, consistent identifier)",
      "imagePrompt": "string (150-250 words, highly detailed)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName1", "CharacterName2"],
      "narration": "string (10-15 words)",
      "imagePrompt": "string (100-200 words, extremely detailed)",
      "videoPrompt": "string (80-150 words, focused on animation and movement)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (80-150 words, focused on perspective + movement)"
        }
      ]
    }
  ]
}

Generate the complete video blueprint now in valid JSON format only:`;
}

// Helper function to provide style-specific guidelines
function getStyleGuidelines(style: string): string {
  const styleMap: Record<string, string> = {
    'Pixar 3D': '- Use high-quality 3D rendering with soft, appealing character designs\n- Apply warm, inviting lighting with slight rim lighting on characters\n- Include rich, saturated colors with smooth gradients\n- Emphasize expressive faces and personalities\n- Use depth of field to focus attention on main subjects\n- Animations: Smooth, bouncy movements with personality; exaggerated but appealing character motion',
    'Cinematic': '- Emphasize dramatic lighting and composition\n- Use depth of field and atmospheric effects\n- Apply film-like color grading and mood\n- Include cinematic camera angles (low angles, Dutch tilts, tracking shots)\n- Create a professional, high-production-value aesthetic\n- Animations: Slow, deliberate camera movements; subtle character motion; cinematic pacing',
    'Ghibli': '- Use hand-drawn aesthetic with soft, painterly textures\n- Apply gentle, naturalistic lighting with warm tones\n- Include lush, detailed backgrounds with atmospheric depth\n- Emphasize whimsical, flowing character designs\n- Use pastel and earth-tone color palettes\n- Create dreamy, nostalgic atmospheres\n- Animations: Gentle, flowing movements; nature elements animate softly; peaceful pacing',
    'Anime': '- Include expressive features with large, detailed eyes\n- Use vibrant colors and sharp contrasts\n- Apply cel-shading and anime-style effects\n- Emphasize dynamic poses and action lines\n- Include dramatic lighting and shadows\n- Use speed lines or motion blur for action\n- Animations: Can be more dynamic; expressive character movements; dramatic camera work for action',
    'Cyberpunk': '- Emphasize neon lights and glowing elements (cyan, magenta, purple)\n- Use high contrast with deep shadows and bright highlights\n- Include futuristic technology, holograms, and digital displays\n- Apply rain-slicked surfaces and reflections\n- Create dark, gritty urban environments\n- Use lens flares and atmospheric fog\n- Animations: Glitching effects, hologram flickers, neon pulsing, rain and fog movement',
    'Watercolor': '- Apply soft, fluid brushstroke textures\n- Use translucent, layered colors with natural blending\n- Include paper texture and organic edges\n- Emphasize gentle color transitions and gradients\n- Create dreamy, artistic atmospheres\n- Use light, airy compositions with white space\n- Animations: Very subtle, gentle movements; watercolor bleeding effects; soft camera motion'
  };

  const styleLower = style.toLowerCase();
  for (const [key, value] of Object.entries(styleMap)) {
    if (key.toLowerCase() === styleLower) {
      return value;
    }
  }

  return '- Ensure all visual elements match the specified style consistently\n- Use appropriate lighting and composition for the chosen aesthetic\n- Maintain style consistency across all scenes\n- Animations: Keep movements appropriate for the style; avoid breaking the aesthetic with inappropriate motion';
}




// Direct prompts for image generation
export const PROMPT = `Generate a high-resolution, production-grade advertising image for the provided product. The image should be visually stunning, appealing, and ready for commercial use.
Key elements to incorporate:
Dynamic Composition: Place the product prominently, but within a visually engaging and balanced composition. Avoid a static, centered shot. Consider rule of thirds, leading lines, or a slightly off-center placement to create visual interest.
Sophisticated Lighting: Employ professional studio lighting techniques. This could be soft, diffused lighting for an elegant look, dramatic contrast lighting for a bold statement, or natural light simulation that highlights the product's texture and form. The lighting should emphasize the product's best features and create depth.
Appealing Background/Environment: Create a relevant, aesthetically pleasing background that complements the product without distracting from it.
For lifestyle products: A subtle, blurred background suggesting a luxurious home, a serene outdoor setting, or a modern workspace.
For food/beverage: A clean, minimalist kitchen counter, a rustic wooden surface, or a vibrant natural setting.
For tech/gadgets: A futuristic, sleek surface, a minimalist desk, or an abstract background with soft geometric shapes.
For beauty/fashion: A clean, elegant studio backdrop, a soft natural fabric, or a subtly textured wall.
Ensure the background's color palette harmonizes with the product.
Subtle Storytelling/Context (Optional but Recommended): If appropriate, include subtle props or environmental cues that hint at the product's use case or the lifestyle it promotes. These should be minimal and carefully integrated, not cluttering the image. For example, a single delicate flower next to a perfume bottle, or a few artfully scattered coffee beans near a coffee maker.
High-Fidelity Details & Textures: Render the product with exquisite detail, showcasing its material, texture, and finish. Ensure reflections (if applicable) are realistic and flattering.
Color Harmony & Pop: Use a color palette that is cohesive and visually appealing. The product itself should 'pop' against the background, drawing the viewer's eye, without appearing garish. Consider complementary or analogous color schemes.
Desirable Mood/Emotion: Convey a specific feeling or mood. This could be elegance, freshness, innovation, comfort, excitement, or sophistication, depending on the product.
Clean & Polished Aesthetic: The final image should have a professional, polished look. No imperfections, dust, or distracting elements.
Constraint: The focus should remain entirely on the product and its aesthetic appeal. No text overlays, logos (unless part of the product itself), or overt branding beyond the inherent product design.
Please use the provided product image as the central element to be integrated into this enhanced advertising scene.`

export const AVATAR_PROMPT = `Generate a high-resolution, production-grade User-Generated Content (UGC) style advertising image for the provided product, featuring the provided person. The image should be visually stunning, highly appealing, and ready for commercial use, conveying authenticity and relatability.
Key elements to incorporate:
Authentic Interaction & Composition: The provided person should be the central figure, authentically and positively interacting with the product. Capture a natural, candid moment – avoid stiff poses. The composition should feel spontaneous yet visually balanced, drawing the eye to both the person and the product. Consider a slightly off-center placement or dynamic framing that hints at movement or a real-life scenario.
Natural & Inviting Lighting: Employ soft, natural lighting (e.g., golden hour glow, bright diffused daylight indoors by a window, gentle outdoor shade). The lighting should illuminate the person and product warmly, highlighting textures and expressions without harsh shadows. It should create an inviting, approachable mood that enhances the UGC aesthetic.
Relatable & Aesthetically Pleasing Environment: Create a background that feels like a real-life setting where the product would naturally be used. This should complement the scene without distracting from the person and product, ideally with a subtle, soft-focus blur.
For lifestyle/fashion: A cozy living room, a sunlit cafe, a vibrant street scene, a peaceful park, or a stylish, minimalist home corner.
For food/beverage: A kitchen island during meal prep, a picnic blanket outdoors, a cozy dining table, or a friend's gathering.
For tech/gadgets: A casual workspace, an outdoor adventure scene, a relaxed social setting, or a comfortable couch.
For beauty/personal care: A well-lit bathroom vanity, a bright bedroom, or an outdoor self-care moment.
Ensure the background's color palette harmonizes with the overall image, contributing to a sense of warmth and authenticity.
Subtle Storytelling & Lifestyle Context: The image should subtly tell a story about the product's use and how it enhances the person's life. The person's expression and body language should convey genuine enjoyment, comfort, or benefit. Props should be minimal and organic to the scene (e.g., a book next to someone using a mug, a casual accessory complementing an outfit, natural elements in an outdoor setting).
High-Fidelity Details & Textures (Product & Person): Render the product with excellent detail, showcasing its material, texture, and finish. Ensure the person's appearance, including clothing and hair, looks natural and appealing, reflecting a lived-in, relatable quality without being unkempt.
Color Harmony & Vibrant Authenticity: Use a cohesive and visually pleasing color palette that feels natural and bright. The person and product should stand out appealingly against the background, creating a harmonious and vibrant image without artificiality.
Positive & Relatable Mood/Emotion: Convey a positive emotion such as happiness, comfort, satisfaction, ease, or genuine enjoyment. The overall mood should be inviting and approachable, encouraging viewers to imagine themselves in the same positive experience.
Clean & Polished (UGC Style): While aiming for a spontaneous feel, the final image should still be polished and high-quality. Ensure there are no distracting elements, smudges, or imperfections that would detract from its commercial appeal.
Constraint: The focus should be entirely on the authentic interaction between the person and the product. No overt text overlays, artificial logos (unless naturally part of the product's design), or heavy branding beyond the inherent product and person's natural expression.`
/*
const PROMPT = `Create a vibrant product showcase image featuring the uploaded product
in the center, surrounded by dynamic splashes of liquid or relevant material that complement the product.
Use a clean, colorful background to make the product stand out. Include subtle elements related to the product's flavor,
ingredients, or theme floating around to add context and visual interest. 
Ensure the product is sharp and in focus, with motion and energy conveyed through the splash effects.`;

const AVATAR_PROMPT = `Create a photorealistic, studio-quality advertisement image using the FIRST reference image as the product/prop
and the SECOND reference image as the subject (AI avatar). SHOW the avatar actively USING the product (not merely holding it).
Make the action explicit (e.g. eating, sipping, wearing, listening, applying, adjusting) and ensure realistic interaction:
hands, mouth, or body must touch and engage the product naturally. Preserve the avatar's face, skin tone and hair.
Make the product the clear focal point with sharp detail and appropriate lighting; use shallow depth-of-field to blur the background.
Add subtle thematic elements (sprinkles, musical notes, steam) only if they support the action. Avoid extra people, floating products,
cut-off limbs, or unnatural poses. Shot: mid-shot or close-up as appropriate for the product. Studio-quality soft key light + rim light.
High resolution, photorealistic, realistic shadows/reflections, no text or logos.`;
*/

export function videoGenerationPromptDramatic(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director and scriptwriter creating detailed video blueprints for DRAMATIC STORYTELLING videos in the style of motivational/inspirational short-form content.

## Your Task
Generate a complete video blueprint in JSON format based on the user's prompt and specifications. This blueprint will guide the creation of an EMOTIONALLY COMPELLING NARRATIVE video with cinematic scenes and powerful storytelling.

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - DRAMATIC STORYTELLING FORMAT

Your video MUST follow this proven narrative structure:

### Narrative Pacing:
- **Hook (First 5-10 seconds)**: Start with a powerful dialogue quote or dramatic moment that immediately grabs attention
- **Context Setup (10-20 seconds)**: Introduce the protagonist and their initial situation
- **Rising Action (20-50% of video)**: Build tension through struggle, conflict, or challenge
- **Crisis/Low Point (50-70% of video)**: Show the darkest moment, the breaking point
- **Turning Point (70-85% of video)**: Present the moment of realization, divine intervention, or critical decision
- **Resolution (85-95% of video)**: Show the transformation or revelation
- **Moral/Call-to-Action (Final 5-10 seconds)**: End with a powerful universal truth and engagement prompt

### Scene Characteristics:
- **Dialogue-Driven**: Many scenes should feature powerful spoken lines that appear as on-screen text
- **Cinematic Transitions**: Each scene should flow dramatically into the next
- **Emotional Beats**: Every scene must have clear emotional weight (despair, hope, shock, realization)
- **Visual Symbolism**: Use metaphorical imagery (storms for crisis, sunrise for hope, fire for transformation)
- **Character Focus**: Keep the protagonist central - show their face, reactions, body language
- **Atmospheric Intensity**: Use lighting, weather, and environment to amplify emotion

### Narration Style:
- **Present Tense Storytelling**: Write as if events are unfolding now ("he walks," not "he walked")
- **Short, Punchy Sentences**: Maximum 15 words per narration line
- **Vivid Action Verbs**: Use powerful, evocative language
- **Emotional Anchoring**: Every line should carry emotional weight
- **Dialogue Integration**: Mix narration with character dialogue/thoughts
- **Build Suspense**: Each line should propel the story forward
- **Universal Themes**: Touch on relatable human experiences (redemption, betrayal, faith, transformation)

### Visual Storytelling Requirements:
1. **Character Close-ups**: Frequent facial expressions showing raw emotion
2. **Symbolic Imagery**: Visual metaphors that reinforce the theme
3. **Contrast Moments**: Show before/after, wealth/poverty, darkness/light
4. **Environmental Storytelling**: Use setting to reflect internal state
5. **Cinematic Composition**: Frame each shot like a movie still
6. **Dynamic Camera Work**: Use movement to enhance emotional impact

## Understanding the Workflow
Your blueprint will be used in this process:
1. Character images will be generated from character descriptions for consistency
2. Main scene images will be generated from scene imagePrompts + character reference images
3. Videos will be created by animating these images using the videoPrompt (camera motion and movements) + character reference images
4. Angle images will be generated using the main scene as a reference + angleVideoPrompt
5. Angle videos will be animated with their specific camera movements
6. All clips will be edited together to create the final video

**IMPORTANT**: Character reference images will be automatically provided to the image/video generation models based on the charactersInTheScene array. Your prompts should reference characters naturally without needing to fully re-describe them.

## Output Requirements

### 1. Title
Generate a compelling, emotionally charged title (5-12 words) that hints at transformation or revelation.
Examples: "The Fire That Saved Him From Himself" or "She Despised Him Until She Saw His Name"

### 2. Characters
Identify all main characters/subjects in the story. For EACH character, provide:
- **name**: Character identifier that reflects their role or arc (e.g., "Broken Billionaire", "Ashamed Wife", "Humble Worker", "Redeemed Father")
  - Use names that hint at their journey or transformation
  - Names should be memorable and emotionally resonant
- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words) for generating a consistent character reference image. Must include:
  - Age and physical appearance that suggests their life circumstances
  - Facial features that can convey deep emotion (weathered, determined, broken, prideful)
  - Clothing that reflects their social status or journey (tattered survivor clothes, designer suits, work uniforms)
  - Distinctive features that make them memorable
  - Emotional state conveyed through posture and expression
  - Visual details that hint at their backstory
  - Exact style matching "${style}"

**CRITICAL**: Focus on creating characters who can visually convey a transformation journey. Their appearance should tell part of their story.

Example: "A 40-year-old man with salt-and-pepper stubble, deep-set exhausted eyes that have seen loss, wearing torn designer clothes now covered in dirt and blood, face gaunt from hunger, shoulders slumped in defeat yet a flicker of desperate hope remains in his gaze, cinematic realistic style with dramatic natural lighting"

### 3. Scenes
Break down the story into ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes based on the ${durationInSecs} second duration.

**CRITICAL SCENE STRUCTURE**: Follow the dramatic arc religiously:
- Scene 1: HOOK - Dramatic opening (dialogue or crisis moment)
- Scenes 2-3: CONTEXT - Establish character and situation
- Scenes 4-6: RISING CONFLICT - Build tension and struggle
- Scenes 7-8: CRISIS - The breaking point/darkest moment
- Scenes 9-10: TURNING POINT - Realization or intervention
- Scenes 11-12: RESOLUTION - Transformation revealed
- Final Scene: MORAL - Universal truth and call-to-action

For each scene, provide:

- **index**: Scene number (starting from 0)

- **charactersInTheScene**: Array of character names that appear in this scene
  - Use EXACT character names as defined in the Characters section
  - List all characters visible in the scene

- **narration**: (REQUIRED for most scenes) Voice-over narration that drives the story (8-15 words)
  - **MANDATORY ELEMENTS**:
    * Use present tense and active voice
    * Create emotional resonance
    * Build suspense or reveal character motivation
    * Use powerful, evocative verbs
    * Include dialogue in quotation marks when appropriate
    * Make every word count - cut filler phrases
  - **Examples**:
    * "You'll never be satisfied." Her last words before walking away forever.
    * He believed money could fill the emptiness inside.
    * The engine explodes. The aircraft spirals into the ocean.
    * For the first time, he understands true loneliness.
    * "God, are you listening? I'll start over."
    * The fire he feared became the signal that saved him.
  - Use empty string "" ONLY for purely visual moments (max 1-2 per video)

- **imagePrompt**: EXTREMELY DETAILED description (120-250 words) for the main establishing shot. Must include:
  - **Emotional Tone**: Set the mood first (desperate, hopeful, devastating, triumphant)
  - **Camera Composition**: Professional cinematography (close-up on tear-streaked face, wide shot of isolation, low angle showing defeat, aerial view of devastation)
  - **Character State**: Describe the emotional and physical state clearly
  - **Setting Details**: Environment that amplifies emotion (storm-ravaged island, luxury party descending into chaos, corporate gala with spotlight, rain-soaked beach at dawn)
  - **Lighting Mood**: Cinematic lighting that enhances drama (harsh sunlight on weathered skin, golden hour hope, dark shadows of despair, neon-lit revelation)
  - **Symbolic Elements**: Include visual metaphors (shattered champagne glass, rising smoke signal, wedding ring in sand, name on donor plaque)
  - **Color Palette**: Describe colors that match emotional state (desaturated grays for despair, warm golds for hope, cold blues for isolation)
  - **Composition for ${aspectRatio}**: Frame for maximum emotional impact
  - **Style Match**: Must match "${style}" exactly

**CRITICAL IMAGEPROMPOT GUIDELINES**:
- Start with the emotional core: "Devastating close-up of..." or "Triumphant wide shot of..."
- Build from emotion → character → environment → details
- Every visual element should serve the story's emotional truth
- Think in freeze-frames that could stand alone as powerful photographs

- **videoPrompt**: Detailed description (100-180 words) for animating the main scene image. Must include:
  - **Camera Movement**: Slow, deliberate, emotionally motivated (camera slowly pushes in on face as realization dawns, camera pulls back revealing devastating isolation, gentle pan across aftermath, orbit around moment of transformation)
  - **Character Motion**: Subtle but powerful (shoulders shake with silent sobs, head slowly turns toward hope, hands tremble as realization hits, body collapses in exhaustion/relief, eyes close then open with new determination)
  - **Environmental Animation**: Amplify mood (storm intensifies, dawn light slowly spreads, rain continues falling, smoke rises into sky, waves crash against shore)
  - **Emotional Pacing**: Movement should build or release tension appropriately
  - **Duration**: Movements paced for 6-10 second clip that tells micro-story

**CRITICAL VIDEOPROMPT GUIDELINES**:
- Every movement must have emotional purpose
- Camera moves should guide viewer's emotional journey
- Character movements reveal internal state
- Environment reinforces the emotional beat
- Maintain cinematic pacing - nothing rushed, nothing static without reason

- **angles**: (STRATEGIC USE - 50% of key scenes should have 1-2 angles)
  
  When to include angles:
  - **Emotional Reveals**: Close-ups when character has realization or breakdown
  - **Dialogue Moments**: Face shots during powerful spoken lines
  - **Symbolic Details**: Close on key objects (ring, scar, fire, plaque, torn photo)
  - **Reaction Shots**: Capturing the moment of shock, despair, or hope
  - **Transformation Moments**: Before/after visual contrasts
  
  Each angle object contains:
  - **index**: Angle number within this scene (starting from 0)
  - **angleVideoPrompt**: Detailed description (100-180 words) of the alternative angle WITH animation. Must include:
    - **Specific Focus**: What this angle reveals (eyes welling with tears, hands gripping sand, name on wall, destroyed shelter)
    - **Camera Type**: Extreme close-up, over-shoulder, low angle looking up, detail shot
    - **Emotional Purpose**: Why this angle matters to the story
    - **Movement**: How camera and subject move (slow zoom into eyes, camera tilts up from object to face, focus rack from foreground to background)
    - **Symbolic Weight**: What this visual represents in the larger narrative

## Critical Guidelines for Dramatic Storytelling

1. **Emotional Architecture**: Every scene must advance the emotional journey
2. **Visual-Narrative Synergy**: What's shown must amplify what's narrated
3. **Character Transformation Tracking**: Visually show the journey from one state to another
4. **Symbolic Consistency**: If fire represents destruction, show it becoming salvation
5. **Pacing Mastery**: Balance fast-paced crisis with slow-burn realization
6. **Dialogue Integration**: Use character voice for maximum impact moments
7. **Universal Resonance**: Themes should feel personally relatable
8. **Cinematic Quality**: Every frame should feel intentionally composed
9. **Emotional Authenticity**: Avoid melodrama - ground moments in real feeling
10. **Moral Clarity**: End with a truth that lingers beyond the video

## Animation Guidelines for Dramatic Storytelling:
- **Camera movements must serve emotion**: Push in during realization, pull out during isolation, orbit during transformation
- **Character movements must feel authentic**: Trembling hands, defeated shoulders, determined gaze
- **Environment must be an active character**: Storm raging during crisis, dawn breaking during hope, smoke rising as rescue signal
- **Timing creates meaning**: Slow movements build tension, sudden movements shock, stillness creates weight
- **Symbolic motion matters**: Fire flickering, water receding, light spreading, shadows lifting

## Narration Writing Masterclass

**DO**:
✓ "Thunder cracks. The shelter tears apart. Everything washes away."
✓ "He falls to his knees. 'I was wrong. I betrayed everything.'"
✓ "'How did you find me?' 'We saw the smoke. Your signal.'"
✓ "The fire meant to destroy him became his rescue."

**DON'T**:
✗ "He experienced a difficult time during the storm."
✗ "He felt regret about his past choices."
✗ "Eventually, help arrived for him."
✗ "Things worked out in the end."

**FORMULA**: [Action Verb] + [Specific Detail] + [Emotional Weight]
- "He screams into the rain" (not "he is upset")
- "She walks out forever" (not "she leaves him")
- "The name on the wall freezes her" (not "she is surprised")

## Style-Specific Considerations for "${style}":
${getStyleGuidelinesDramatic(style)}

## Additional Dramatic Storytelling Requirements

### Opening Hook Requirements:
- First scene narration must grab attention in under 3 seconds
- Options: Shocking dialogue, dramatic action, provocative statement
- Examples: "You'll never be satisfied." / "The explosion tears the sky apart." / "This place isn't for you."

### Crisis Moment Requirements:
- Must have clear visual and emotional low point
- Character should be physically shown in desperation (on knees, collapsed, looking up at sky)
- Environment should amplify crisis (storm, destruction, isolation)
- Narration should reveal internal breakdown

### Transformation Requirements:
- Show visible change from beginning to end
- Use visual symbols (sunrise after storm, clean clothes after rags, confidence after defeat)
- Narration should state the universal truth learned
- Final scene should inspire or provoke thought

### Call-to-Action Requirements:
- End with relatable universal statement
- Invite engagement ("Type Amen", "Share this story", "Tag someone who needs this")
- Keep final moral concise and memorable (10-20 words)

## JSON Output Structure

Output ONLY valid JSON with NO additional text or explanations:

{
  "title": "string (5-12 words, emotionally compelling)",
  "characters": [
    {
      "name": "string (role-based or transformation-based)",
      "imagePrompt": "string (150-250 words, emotionally detailed)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (8-15 words, present tense, emotionally charged)",
      "imagePrompt": "string (120-250 words, emotion-first description)",
      "videoPrompt": "string (100-180 words, emotionally motivated animation)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (100-180 words, emotional close-up with movement)"
        }
      ]
    }
  ]
}

Generate the complete dramatic storytelling video blueprint now in valid JSON format only:`;
}

// Helper function to provide style-specific guidelines
function getStyleGuidelinesDramatic(style: string): string {
  const styleMap: Record<string, string> = {
    'Cinematic': `**PERFECT MATCH FOR DRAMATIC STORYTELLING**
- Use film-grade color grading with emotional color temperatures (cool blues for despair, warm golds for hope)
- Apply dramatic lighting: rim lighting on characters, high contrast shadows, volumetric god rays
- Employ cinematic depth of field: focus on emotional subjects, blur backgrounds for isolation
- Use professional camera techniques: slow push-ins during realization, pull-backs for devastation, dutch tilts for chaos
- Include atmospheric effects: rain, fog, dust particles, smoke, lens flares
- Create movie-quality composition: rule of thirds for tension, centered framing for confrontation
- Animations: Slow, weighty camera movements; subtle character gestures with emotional weight; environmental elements that amplify mood (rain falling, fire crackling, waves crashing)
- Color palette: Desaturated during crisis, color returns during hope, golden hour for redemption
- Lighting transitions: From harsh shadows to soft light as story progresses`,

    'Pixar 3D': `**ADAPTED FOR EMOTIONAL STORYTELLING**
- Apply appealing but emotionally expressive character designs (can show sadness, determination, defeat)
- Use lighting to convey emotion: warm for hope, cool for sadness, dramatic rim lighting for important moments
- Include rich, saturated colors during positive moments, desaturated during crisis
- Emphasize facial expressions: large eyes showing tears, exhaustion, hope, realization
- Use depth of field to isolate characters in emotional moments
- Animations: Smooth, expressive movements; exaggerated emotional gestures (shoulders slumping in defeat, standing tall in triumph); bouncy recovery movements during hope`,

    'Ghibli': `**ADAPTED FOR POETIC STORYTELLING**
- Use hand-drawn aesthetic with emotional brushwork (rough textures for turmoil, soft for peace)
- Apply naturalistic lighting with emotional color temperatures (grey for sadness, golden for hope)
- Include lush backgrounds that reflect internal state (wilted nature during crisis, blooming during recovery)
- Emphasize flowing, expressive character designs showing subtle emotions
- Use earth tones during struggle, brighter pastels during hope
- Create contemplative, emotionally resonant atmospheres
- Animations: Gentle, flowing movements; natural character motion showing exhaustion or renewed energy; environmental elements moving poetically (leaves falling, wind blowing, light filtering through)`,

    'Anime': `**ADAPTED FOR INTENSE EMOTIONAL DRAMA**
- Include highly expressive eyes showing raw emotion (tears, determination, shock, despair)
- Use dramatic color shifts based on emotional state (vibrant for confidence, washed out for defeat)
- Apply intense cel-shading with dramatic shadows during emotional moments
- Emphasize dynamic poses showing character state (collapsed in defeat, standing triumphant)
- Include dramatic lighting: harsh shadows for darkness, breakthrough light for hope
- Use visual emotion indicators: rain during sadness, harsh sun during struggle, sunrise during redemption
- Animations: Can be highly expressive; dramatic camera movements during crisis; intense character reactions; environmental drama (wind, rain, lightning)`,

    'Cyberpunk': `**ADAPTED FOR MODERN URBAN DRAMA**
- Use neon lights emotionally: cold blues/cyans for isolation, warm magentas for humanity
- Apply high contrast: deep shadows for despair, neon glows for hope or revelation
- Include urban decay reflecting internal breakdown: rain-slicked streets, flickering signs
- Create gritty, atmospheric environments: dark alleys for low points, illuminated corporate spaces for revelation
- Use technological elements symbolically: glitching during crisis, stable holograms during recovery
- Apply lens flares and atmospheric fog for dramatic effect
- Animations: Glitch effects during mental breakdown; hologram stabilization during realization; rain and neon reflections; dramatic lighting changes`,

    'Watercolor': `**ADAPTED FOR POETIC, INTROSPECTIVE STORYTELLING**
- Apply emotional brushwork: rough, dark strokes for turmoil, soft, light strokes for peace
- Use translucent layering to show emotional depth and complexity
- Include organic, flowing edges that reflect emotional fluidity
- Emphasize color bleeding and blending during emotional transitions
- Create dreamy, introspective atmospheres for reflection moments
- Use white space symbolically: emptiness during loss, fullness during redemption
- Animations: Very subtle, contemplative movements; watercolor bleeding effects showing emotional spread; gentle camera drifts; soft character movements showing exhaustion or peace`
  };

  const styleLower = style.toLowerCase();
  for (const [key, value] of Object.entries(styleMap)) {
    if (key.toLowerCase() === styleLower) {
      return value;
    }
  }

  return `**GENERAL DRAMATIC STORYTELLING APPROACH**
- Ensure all visual elements serve the emotional narrative
- Use lighting to convey character's internal state (dark for despair, light for hope)
- Apply color grading that shifts with emotional journey
- Include atmospheric effects that amplify mood (rain, fog, dramatic skies)
- Maintain style consistency while prioritizing emotional storytelling
- Animations: Every movement must have emotional motivation; camera serves the story; environmental elements reflect internal state`;
}
