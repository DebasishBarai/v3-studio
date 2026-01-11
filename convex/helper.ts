import { characterSchema, sceneSchema } from "./schema";

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
  return `You are a professional video director and scriptwriter creating detailed video blueprints for EMOTIONAL NARRATIVE videos in the style of inspirational short-form storytelling content.

## Your Task
Generate a complete video blueprint in JSON format based on the user's prompt and specifications. This blueprint will guide the creation of a DEEPLY MOVING, character-driven narrative video with cinematic scenes and heartfelt storytelling.

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - EMOTIONAL NARRATIVE FORMAT

Your video MUST follow this proven narrative structure inspired by viral motivational storytelling:

### Narrative Arc Framework:
- **Devastating Hook (0-8 seconds)**: Open with cruel dialogue or harsh judgment that establishes the wound
  * Examples: "She's too fat. No one will ever want her."
  * "You'll never be satisfied, Edward."
  * "This place isn't for you. Stop embarrassing me."
  
- **Backstory & Context (8-25 seconds)**: Introduce protagonist and their painful circumstances
  * Show their current suffering or situation
  * Establish what they've lost or never had
  * Build empathy through vivid details
  
- **The Descent/Struggle (25-45% of video)**: Show the depth of their pain or challenge
  * Physical hardship, emotional rejection, or loss
  * Moments of survival, adaptation, or forced acceptance
  * Building tension through accumulated suffering
  
- **Glimmers of Hope (45-60% of video)**: Introduce the turning point elements
  * New person/situation that shows unexpected kindness
  * Small moments of beauty or connection
  * The protagonist begins to soften or change perspective
  
- **The Transformation (60-80% of video)**: Show the journey of healing or growth
  * Concrete actions: learning, adapting, building relationships
  * Visual proof of change: smiles returning, confidence growing
  * Love, faith, or perseverance taking root
  
- **The Revelation/Vindication (80-95% of video)**: The powerful reversal moment
  * Those who rejected them see the truth
  * The protagonist's worth is undeniably proven
  * The universe/God/fate delivers poetic justice
  
- **Universal Truth & Call-to-Action (Final 5-10 seconds)**: End with wisdom and engagement
  * Relatable life lesson that resonates beyond the story
  * Engagement prompt (Comment/Share/Type message)

### Core Storytelling Principles:

**1. DIALOGUE-DRIVEN OPENING**
- ALWAYS start with spoken words (harsh judgment, cruel dismissal, or prophetic statement)
- These words become the central wound or prophecy the story addresses
- Format: Direct quotes in narration that cut deep emotionally

**2. SLOW-BURN EMOTIONAL DEVELOPMENT**
- Don't rush the transformation - let viewers feel each stage
- Show GRADUAL change through specific, concrete moments
- Use time markers: "Days passed..." "Years later..." "That evening..."
- Build emotional investment through accumulation of details

**3. KINDNESS AS CONTRAST**
- After establishing cruelty/rejection, show unexpected gentleness
- The contrast between harsh world and gentle savior creates emotional power
- Key phrase patterns: "But what greeted her was..." "Instead of mockery, she found..."

**4. SENSORY-RICH DESCRIPTIONS**
- Include specific visual details: "worn-out shoes," "dusty Texas road," "sun-tanned skin"
- Environmental storytelling: farms, islands, corporate galas, storms
- Use weather and lighting to mirror emotional states

**5. RELATIONSHIP BUILDING**
- Show connection through small, tender moments
- Use dialogue that reveals character: "This isn't comfort. It's the truth. I love you."
- Build trust gradually: working together, sharing stories, laughing again

**6. THE REVERSAL MOMENT**
- Those who abandoned/mocked return to witness the transformation
- Create visual contrast: expected misery vs. actual thriving
- Parent/spouse/doubter's reaction: shock, tears, shame, or frozen disbelief

**7. MORAL CLARITY**
- End with a simple, profound truth anyone can relate to
- Examples: "Love sees the heart, not appearance" / "Fire meant to destroy can become your rescue"
- Tie directly to the opening wound/judgment

### Scene Characteristics:
- **Character-Centric Framing**: Focus on faces, reactions, body language showing internal state
- **Environmental Storytelling**: Settings that reflect journey (run-down → beautiful, chaotic → peaceful)
- **Symbolic Objects**: Suitcases, rings, fires, plaques, photographs, torn clothes, fresh bread
- **Time Transitions**: Clear visual markers showing passage of time and change
- **Emotional Beats Per Scene**: Every 8-12 seconds should have a distinct emotional moment
- **Lighting Journey**: Dark/harsh at beginning → warm/golden at resolution

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Opening Cruelty** (First scene)
   - Direct quote of harsh judgment
   - Format: "She's too fat. No one will ever want her."
   - Immediately followed by: "Those words had been branded into [name]'s heart/life"

2. **Descriptive Storytelling** (Middle scenes)
   - Present tense action: "He walks," "She clutches," "The fire spreads"
   - Vivid sensory details: "sun-tanned," "tear-streaked," "dust-covered"
   - Specific, concrete imagery: not "he was sad" but "tears poured down his face"

3. **Dialogue Integration** (Key emotional moments)
   - Characters speak directly: "'I love you.' / 'How did you find me?'"
   - Inner thoughts revealed: "'God, are you listening? I'll start over.'"
   - Short, powerful exchanges that reveal character

4. **Transition Phrases** (Time passage)
   - "Days passed..." / "Years later..." / "That evening..."
   - "For the first time..." / "Eventually..." / "In time..."
   - "Before she could respond..." / "As the sun set..."

5. **Contrast Statements** (Turning points)
   - "But what greeted her was..." / "Instead, they saw..."
   - "She expected mockery. She found kindness."
   - "He thought the fire would kill him. It became his rescue."

6. **Universal Truth Closing** (Final scene)
   - "If you believe [universal truth], [engagement action]"
   - "Sometimes [lesson]. When [situation], maybe [truth]."
   - "Never underestimate [wisdom]. God [theological insight]."

**SENTENCE STRUCTURE:**
- Keep narration lines 8-15 words maximum
- Use short, punchy sentences for impact
- Vary rhythm: short-short-long pattern for emphasis
- Active voice always: "He walks" not "He walked"
- Eliminate filler words: cut "very," "really," "just," "that"

**EMOTIONAL VOCABULARY:**
✓ Branded, shattered, collapsed, froze, trembled, clutched, poured, blazed
✓ Harsh, gentle, warm, cold, devastating, tender, brutal, soft
✓ Abandoned, cherished, rejected, treasured, dismissed, adored
✗ Avoid: felt, seemed, appeared, somewhat, rather, quite

## Understanding the Workflow
Your blueprint will be used in this process:
1. Character images will be generated from character descriptions for consistency
2. Main scene images will be generated from scene imagePrompts + character reference images
3. Videos will be created by animating these images using the videoPrompt + character reference images
4. Angle images will be generated using the main scene as a reference + angleVideoPrompt
5. Angle videos will be animated with their specific camera movements
6. All clips will be edited together to create the final video

**IMPORTANT**: Character reference images will be automatically provided to the image/video generation models based on the charactersInTheScene array. Your prompts should reference characters naturally without needing to fully re-describe them.

## Output Requirements

### 1. Title
Generate a compelling, emotionally charged title (6-12 words) that hints at transformation, vindication, or life lesson.

**Title Formula Options:**
- "[Rejection] Until [Reversal]" → "They Abandoned Her for Being 'Too Fat'... Until Life Proved Them Wrong"
- "The [Thing] That [Unexpected Result]" → "The Fire That Saved Him From Himself"
- "[Person] [Harsh Action] Until [Revelation]" → "She Despised Him Until She Saw His Name on the Wall"
- "How [Harsh Situation] Became [Beautiful Outcome]" → "How Betrayal Became His Greatest Blessing"

### 2. Characters
Identify 2-5 main characters maximum. For EACH character, provide:

- **name**: Character identifier reflecting their role in the emotional journey
  * For protagonists: Names that suggest their arc
    - "Rejected Daughter" / "Abandoned Woman" / "Broken Billionaire" / "Humble Worker"
  * For antagonists/secondary: Names showing their function
    - "Cruel Father" / "Ashamed Wife" / "Gentle Farmer" / "Kind Rescuer"
  * Use actual names if story-appropriate: "Rachel" / "Edward" / "Lucas" / "Caleb"
  
- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words) capturing their essence. Must include:
  - **Age and Life Stage**: Specific age that fits their journey (23-year-old, 40-year-old weathered)
  - **Physical Appearance Reflecting Story**: 
    * Protagonist at start: "Worn faded dress," "tear-streaked face," "defeated shoulders"
    * Protagonist transformed: "Confident smile," "warm glow," "carrying baby with ease"
  - **Facial Features with Emotional Depth**: 
    * "Deep-set exhausted eyes that have seen loss"
    * "Large expressive eyes showing vulnerability"
    * "Sun-weathered face with gentle eyes"
  - **Clothing That Tells Story**:
    * Class markers: "designer suit now tattered," "worn-out shoes," "simple farm clothes"
    * Transformation indicators: "torn survival gear" → "clean wedding attire"
  - **Distinctive Memorable Features**:
    * "Salt-and-pepper stubble," "calloused hands," "broad shoulders"
    * "Long hair tied back," "wedding ring worn despite divorce," "scar on left cheek"
  - **Posture and Body Language**:
    * Beginning: "Hunched shoulders," "avoiding eye contact," "clutching suitcase tightly"
    * End: "Standing tall," "confident stride," "relaxed open posture"
  - **Emotional State Conveyed**:
    * "Desperate hope flickering in gaze despite exhaustion"
    * "Gentle warmth radiating from smile"
    * "Hardened exterior barely containing inner pain"
  - **Style Match**: Must perfectly match "${style}"

**CRITICAL CHARACTER DESIGN PRINCIPLES:**
- Characters should be visually capable of showing transformation
- Clothing/appearance should be specific enough to be memorable
- Facial features should allow for expressive emotional range
- Consider how they'll look in both their low point and triumph

**Example for Cinematic Realistic:**
"A 23-year-old woman with soft features and gentle brown eyes that carry years of unspoken hurt, slightly fuller figure wearing a faded floral dress that's too big, worn-out brown shoes with scuffed toes, long dark hair pulled into a simple ponytail, shoulders slightly hunched as if trying to disappear, clutching a small battered suitcase, face showing cautious vulnerability mixed with deep-seated shame, sun-kissed skin, minimal makeup, appearance suggesting someone who's been told she's not enough for so long she almost believes it, cinematic realistic style with natural warm lighting, soft focus on face showing inner strength beneath the pain, composed for emotional intimacy"

### 3. Scenes
Break down the story into ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes based on the ${durationInSecs} second duration.

**MANDATORY SCENE STRUCTURE BASED ON DURATION:**

For 60-90 second videos (8-12 scenes):
- Scene 1: Cruel opening dialogue/judgment
- Scenes 2-3: Backstory and painful context
- Scenes 4-5: Depth of struggle/rejection
- Scenes 6-7: Introduction of hope/kindness
- Scenes 8-9: Gradual transformation/healing
- Scene 10: The reversal/vindication moment
- Scene 11: Universal truth and call-to-action

For 90-180 second videos (12-20 scenes):
- Follow same structure but expand middle sections
- Add more relationship-building moments (scenes 7-12)
- Include additional symbolic moments showing growth
- More detailed reversal sequence (2-3 scenes)

**Each scene MUST include:**

- **index**: Scene number (starting from 0)

- **charactersInTheScene**: Array of character names appearing in this scene
  - Use EXACT names from Characters section
  - List all visible characters: ["Rachel"], ["Rachel", "Caleb"], ["Rachel", "Cruel Father", "Cruel Mother"]
  - Can be empty [] only for pure landscape/symbolic shots (rare)

- **narration**: (REQUIRED for 95% of scenes) Voice-over narration (8-15 words per line)
  
  **NARRATION MUST FOLLOW THESE PATTERNS:**
  
  **For Opening Hook (Scene 1):**
  - Start with direct quote of cruelty: "She's too fat. No one will ever want her."
  - Followed by context: "Those words branded Rachel's heart since childhood."
  
  **For Backstory (Scenes 2-3):**
  - Set specific scene: "The pickup truck rattled along a dusty Texas road."
  - Character action + detail: "Rachel clutched her only suitcase. Faded dress. Worn shoes."
  
  **For Struggle Moments (Scenes 4-5):**
  - Parent/antagonist dialogue: "'You'll marry him. They'll settle our debt. You're their problem.'"
  - Internal state: "Before she could respond, the truck drove away."
  
  **For Hope Introduction (Scenes 6-7):**
  - Contrast setup: "She expected disgust, rejection, mockery."
  - Reveal: "What greeted her was simple, genuine kindness."
  
  **For Transformation (Scenes 8-10):**
  - Time passage + growth: "Days passed. She learned to bake, tend gardens, feed animals."
  - Relationship dialogue: "'You brought this home back to life. You brought me back too.'"
  
  **For Reversal (Scenes 11-12):**
  - Setup: "Years later, her parents visited. Expected to find her miserable."
  - Contrast: "Instead, they saw her holding a baby. Two children playing. Love everywhere."
  
  **For Closing (Final scene):**
  - Universal truth: "Love doesn't look at a body. It looks at the heart."
  - Call-to-action: "If you believe true love sees hearts, leave a heart below."

- **imagePrompt**: EXTREMELY DETAILED description (120-250 words) for the main establishing shot.

  **MANDATORY STRUCTURE FOR IMAGEPROMPTS:**
  
  1. **Lead with Emotional Tone + Shot Type** (20-30 words)
     - "Heartbreaking medium shot of Rachel standing alone..."
     - "Warm, hopeful wide shot showing the thriving farm..."
     - "Devastating close-up revealing tear-streaked face..."
  
  2. **Character Positioning & State** (30-40 words)
     - Where they are in frame (center, foreground, background)
     - What they're doing (clutching suitcase, kneeling in rain, holding baby)
     - Physical state (exhausted, glowing, defeated, confident)
     - Facial expression (avoiding eyes, gentle smile, frozen shock)
  
  3. **Environmental Context** (40-60 words)
     - Specific location: "dusty Texas farm at sunset," "rain-soaked tropical island"
     - Key objects: "battered suitcase," "wooden fence," "wedding ring in sand"
     - Atmospheric elements: "dust particles in golden light," "storm clouds gathering"
     - Background action: "children playing on grass," "waves crashing"
  
  4. **Lighting & Mood** (20-30 words)
     - Light quality: "harsh afternoon sun," "soft golden hour," "grey storm light"
     - Mood reinforcement: "casting long shadows of isolation," "warm glow of belonging"
     - Symbolic lighting: "breaking through clouds," "dim and oppressive"
  
  5. **Color Palette & Style Details** (20-30 words)
     - Emotional colors: "desaturated browns and greys," "warm golds and ambers"
     - Texture notes: "worn fabric," "weathered wood," "soft focus on face"
     - Style match: "cinematic realistic with natural depth of field"
  
  6. **Composition for ${aspectRatio}** (10-20 words)
     - Frame composition: "rule of thirds with Rachel right-of-center"
     - Depth layers: "foreground suitcase, midground Rachel, background departing truck"
     - Visual flow: "leading lines from fence to couple"

  **CRITICAL IMAGEPROMPT PRINCIPLES:**
  - Think in freeze-frames that tell a story on their own
  - Every element should serve the emotional narrative
  - Be specific about distances: "5 feet away," "background 20 yards behind"
  - Include symbolic objects that viewers will remember
  - Character reference images will be provided, so focus on positioning/action/emotion over appearance re-description

- **videoPrompt**: Detailed description (100-180 words) for animating the main scene image.

  **MANDATORY STRUCTURE FOR VIDEOPROMPTS:**
  
  1. **Primary Camera Movement** (30-40 words)
     - Specific motion: "Camera slowly pushes forward from medium to close-up over 8 seconds"
     - Emotional purpose: "gradually revealing the pain in her eyes"
     - Speed: "Smooth, deliberate dolly movement, cinematic pacing"
     - Alternative: "Static camera with no movement, allowing moment to breathe"
  
  2. **Character Animation** (40-60 words)
     - Primary character: "Rachel's shoulders rise and fall with held-back sobs"
     - Subtle movements: "Her fingers tighten grip on suitcase handle"
     - Facial micro-expressions: "Eyes blink slowly, looking down then away"
     - Natural gestures: "Weight shifts from one foot to other"
     - Breathing: "Chest expands with deep breath of resignation"
  
  3. **Secondary Character(s) Motion** (20-30 words if applicable)
     - "Father in truck turns away, refusing to look back"
     - "Caleb approaches with gentle, unhurried steps"
     - "Children run and play in soft, joyful movements"
  
  4. **Environmental Animation** (30-40 words)
     - Natural movement: "Dust swirls gently in warm evening breeze"
     - Atmospheric: "Wheat stalks sway rhythmically in background"
     - Symbolic: "Sun continues its slow descent, casting longer shadows"
     - Texture: "Fabric of dress ripples slightly in wind"
  
  5. **Pacing & Mood Notes** (10-20 words)
     - "All movements slow and weighted, emphasizing emotional heaviness"
     - "Gentle, peaceful rhythm matching newfound contentment"
     - "Subtle animation allowing dialogue/narration to carry weight"

  **ANIMATION STYLE GUIDELINES BY EMOTION:**
  - **Pain/Rejection**: Minimal movement, camera push-ins, downward gazes, slumped postures
  - **Hope/Kindness**: Gentle sways, warm light shifts, soft smiles emerging, open gestures
  - **Transformation**: Confident movements, upright posture, cameras pulling back to reveal growth
  - **Vindication**: Static powerful stance, reactions from others, camera orbiting to show all angles
  - **Peace/Resolution**: Flowing natural movement, embraces, camera drifts, golden light spreading

- **angles**: (STRATEGIC - Use for 40-50% of emotionally key scenes)
  
  **When to Include Angles:**
  - **Dialogue Moments**: Close-up on face during powerful spoken lines
  - **Emotional Reveals**: Extreme close-up on tears, shaking hands, frozen expression
  - **Symbolic Objects**: Detail shot of ring, fire, suitcase, wedding photo, name on wall
  - **Reaction Shots**: Parent's shock, spouse's shame, child's joy, protagonist's realization
  - **Before/After Contrasts**: Same angle showing transformation (worn shoes → clean ones)
  - **Connection Moments**: Over-shoulder shots during intimate dialogue
  
  Each angle contains:
  - **index**: Angle number within this scene (0, 1, 2...)
  
  - **angleVideoPrompt**: Detailed description (100-180 words) of alternative angle WITH animation.
    
    **Structure:**
    1. **Angle Description** (20-30 words): "Extreme close-up on Rachel's hands clutching worn suitcase handle"
    2. **What It Reveals** (20-30 words): "Shows white knuckles, chipped nail polish, trembling fingers revealing inner turmoil"
    3. **Camera Movement** (20-30 words): "Slow zoom in from close-up to extreme close-up over 5 seconds"
    4. **Subject Motion** (30-40 words): "Fingers slowly tighten grip, knuckles whitening further, slight tremor visible, thumb unconsciously rubbing worn leather"
    5. **Symbolic Weight** (20-30 words): "This suitcase represents everything she owns, all she's allowed to take from her old life"
    6. **Mood Enhancement** (10-20 words): "Shallow depth of field, background blurred, emphasizing isolation and vulnerability"

## Critical Guidelines for Emotional Narrative Videos

1. **Opening Impact**: First 5 seconds must hook with cruelty or crisis
2. **Earned Transformation**: Show concrete steps of change, not sudden flips
3. **Kindness Contrast**: Make goodness powerful by contrasting with cruelty
4. **Sensory Specificity**: Use tangible details (dust, torn fabric, warm bread, sun-tanned skin)
5. **Dialogue as Wounds**: Opening cruelty should echo throughout story
6. **Visual Symbolism**: Objects carry meaning (suitcase = abandonment, ring = broken vows, fire = transformation)
7. **Time Markers**: Clearly show passage of time ("Days passed," "Years later")
8. **Reversal Power**: Those who judged must witness success to complete arc
9. **Universal Resonance**: End with truth everyone can apply to their life
10. **Engagement Hook**: Always end with call-to-action (comment, share, type)

## Advanced Storytelling Techniques

### The "But/Instead" Reversal Pattern:
Use this to create emotional whiplash:
- "She expected [negative]. But what greeted her was [positive]."
- "They came expecting [one thing]. Instead, they found [opposite]."
- "He thought [assumption]. The truth was [revelation]."

### Time Compression Storytelling:
Show transformation through accumulated moments:
- "Days passed. She learned to [skill], [skill], and [skill]."
- "Evening after evening, he [repeated action showing care]."
- "Months later, [visible proof of change]."

### Dialogue That Brands:
Create memorable lines that define the story:
- Opening wound: "You're too fat. No one will ever want you."
- Moment of truth: "This isn't comfort. It's the truth. I love you."
- Final wisdom: "Love doesn't look at a body. It looks at the heart."

### Visual Before/After:
Always create clear visual contrast:
- Beginning: "Worn shoes, faded dress, avoiding eyes, clutching suitcase"
- End: "Holding baby, children playing, loved one's arm around her, confident smile"

## Style-Specific Considerations for "${style}":
${getStyleGuidelinesDramatic(style)}

## JSON Output Structure

Output ONLY valid JSON with NO additional text or explanations:

{
  "title": "string (6-12 words, transformation/vindication focused)",
  "characters": [
    {
      "name": "string (role-based or actual name reflecting journey)",
      "imagePrompt": "string (150-250 words, transformation-capable description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (8-15 words, following required patterns)",
      "imagePrompt": "string (120-250 words, structured: emotion→character→environment→lighting→color→composition)",
      "videoPrompt": "string (100-180 words, structured: camera→character→secondary→environment→pacing)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (100-180 words, structured: angle→reveals→camera→motion→symbolism→mood)"
        }
      ]
    }
  ]
}

Generate the complete emotional narrative video blueprint now in valid JSON format only:`;
}

// Helper function to provide style-specific guidelines
function getStyleGuidelinesDramatic(style: string): string {
  const styleMap: Record<string, string> = {
    'Cinematic': `**PERFECT MATCH FOR EMOTIONAL NARRATIVES**
- **Color Grading Journey**: Start desaturated/cool (rejection phase) → gradually warm (hope phase) → golden/saturated (triumph phase)
- **Lighting Emotional Map**:
  * Harsh, unflattering light during cruelty/abandonment
  * Soft, natural light during kindness introduction
  * Golden hour warm glow during transformation
  * Spotlight/rim lighting for vindication moment
- **Depth of Field Strategy**:
  * Shallow focus isolating protagonist in pain
  * Wider focus showing welcoming environment
  * Selective focus on symbolic objects (ring, suitcase, fire)
- **Camera Language**:
  * Slow push-ins during emotional realization
  * Pull-backs revealing transformation scope
  * Static frames for powerful dialogue moments
  * Low angles for moments of defeat
  * Eye-level for intimacy and connection
- **Atmospheric Effects**: Rain/tears for sorrow, dust motes in sunbeams for hope, soft fog for peace
- **Composition**: Rule of thirds for isolation, centered framing for confrontation, negative space for loneliness
- **Texture Details**: Worn fabric, weathered skin, calloused hands, tear tracks, dust on clothes
- **Animation Pacing**: Slow, weighted movements during pain; gentle, flowing during healing; confident during vindication`,

    'Pixar 3D': `**ADAPTED FOR HEARTFELT ANIMATED STORYTELLING**
- **Character Expressiveness**: Large, expressive eyes showing sadness/hope/joy; exaggerated but sincere facial emotions
- **Color Psychology**: Muted pastels during sadness → vibrant warm colors during happiness
- **Lighting Warmth**: Cool blue-grey during rejection → warm amber during acceptance
- **Environment Personality**: Settings that feel alive - wilting plants during sadness, blooming during joy
- **Appealing Tears**: Stylized but genuine emotion - single tear rolling, eyes glistening
- **Body Language**: Slumped, small during defeat → tall, open during confidence
- **Texture Storytelling**: Soft, fuzzy textures for comfort; rough, hard for harshness
- **Animation Style**: Smooth, slightly exaggerated movements showing internal state; bouncy recovery moments; gentle swaying during peace
- **Symbolic Elements**: Animated in Pixar's magical-realism style (fire glowing warmly, flowers blooming)`,

    'Ghibli': `**ADAPTED FOR POETIC, GENTLE STORYTELLING**
- **Watercolor Emotion**: Rough, darker washes during pain → soft, light washes during healing
- **Natural World Response**: Environment reflects internal state - grey skies/rain for sorrow, sun breaking through for hope
- **Hand-Drawn Warmth**: Soft pencil lines, gentle shading, organic imperfection showing humanity
- **Contemplative Pacing**: Slower, more meditative moments allowing emotion to breathe
- **Pastoral Beauty**: Even in pain, find beauty - worn dress still has delicate floral pattern
- **Character Softness**: Gentle, rounded character designs showing vulnerability and strength
- **Color Palette Journey**: Earth tones and grey during struggle → pastels and warm tones during peace
- **Environmental Details**: Lush backgrounds during hope (thriving farm, blooming flowers), sparse during isolation
- **Animation Philosophy**: Gentle, flowing movements; natural breathing rhythms; peaceful swaying; contemplative stillness`,

    'Anime': `**ADAPTED FOR DRAMATIC EMOTIONAL STORYTELLING**
- **Expressive Eyes**: Large eyes perfect for showing deep emotion - tears, shock, gentle warmth, determination
- **Dramatic Shadows**: Heavy use during dark moments, lightening during hope
- **Color Intensity Shifts**: Washed out during defeat → vibrant during happiness
- **Visual Emotion Lines**: Subtle anime-style emotion indicators (embarrassment blush, determination sparkle)
- **Dynamic Compositions**: Dramatic angles during confrontation, intimate framings during tender moments
- **Cel-Shading Mood**: Harsher shading during conflict, softer during kindness
- **Character Design**: Can show clear visual transformation (tired/disheveled → healthy/confident)
- **Environmental Drama**: Storm clouds during crisis, clear skies during resolution, sunset during romance
- **Animation Energy**: More expressive movements allowed - tears flowing, dramatic turns, emotional collapses, confident strides`,

    'Cyberpunk': `**ADAPTED FOR URBAN EMOTIONAL DRAMA**
- **Neon Emotional Coding**: 
  * Cold blue/cyan for isolation and corporate cruelty
  * Warm magenta/pink for human connection
  * Amber/gold for redemption and hope
- **Urban Decay Metaphor**: Rain-slicked streets during abandonment, neon-lit warmth during acceptance
- **High Contrast Journey**: Deep shadows during rejection → neon illumination during vindication
- **Technology as Symbol**: 
  * Glitching holograms during crisis (broken identity)
  * Stable displays during resolution (found self)
- **Gritty Realism**: Urban poverty showing real struggle, corporate wealth showing hollow success
- **Rain as Constant**: Rain for tears, reflection, cleansing, isolation - throughout transformation
- **Lighting Drama**: Harsh fluorescent during cruelty, soft neon glow during kindness, spotlight during triumph
- **Animation Style**: Subtle glitch effects during emotional turmoil, smooth tech during peace, dramatic neon pulses`,

    'Watercolor': `**ADAPTED FOR GENTLE, INTROSPECTIVE STORYTELLING**
- **Brushwork Emotion**: 
  * Heavy, dark strokes during pain and abandonment
  * Light, delicate strokes during hope and healing
  * Blended, harmonious washes during peace
- **Color Bleeding**: Intentional bleeding showing emotional overflow - tears, overwhelm, release
- **Paper Texture**: Visible texture adding vulnerability and authenticity
- **Transparency Layers**: Multiple layers showing depth of emotion and experience
- **Soft Edges**: Organic, flowing edges reflecting emotional fluidity
- **White Space**: Strategic emptiness showing loneliness, then filling with warmth
- **Pastel Journey**: Grey-blue during sadness → warm peach/coral during love → soft gold during triumph
- **Artistic Imperfection**: Embrace watercolor's unpredictability as metaphor for life's unexpected beauty
- **Animation Subtlety**: Minimal, contemplative movements; gentle bleeding effects; soft breathing rhythms; painterly transitions`
  };

  const styleLower = style.toLowerCase();
  for (const [key, value] of Object.entries(styleMap)) {
    if (key.toLowerCase() === styleLower) {
      return value;
    }
  }

  return `**GENERAL EMOTIONAL STORYTELLING APPROACH**
- Use style's strengths to show emotional journey from pain to healing
- Lighting should track emotional state: dark/harsh → warm/soft
- Color palette should shift: desaturated/cool → saturated/warm
- Character appearance should show transformation visually
- Environment should reflect internal state
- All stylistic choices serve the emotional narrative
- Animation pacing should match emotional weight of each moment`;
}


// premium video generation prompt
export function videoGenerationPromptPremium(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director and scriptwriter creating detailed video blueprints for AI-generated videos with SYNCHRONIZED AUDIO AND VISUALS.

## Your Task
Generate a complete video blueprint in JSON format for a premium AI video model (Veo 3.1) that generates audio alongside video. This blueprint will guide the creation of a dialogue-driven video with consistent character voices and cinematic visuals.

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL: Premium Model Differences

**AUDIO GENERATION IS BUILT-IN:**
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on CHARACTER DIALOGUE and SPOKEN WORDS, not narrator voice-over
- Minimal narration - only use when characters aren't speaking
- Describe ambient sounds, music, and sound effects that enhance scenes
- Character voices must be described in EXTREME DETAIL for consistency

**VOICE CONSISTENCY SYSTEM:**
- Each character gets a detailed voice profile
- Voice descriptions are referenced in every scene where the character speaks
- The model uses these descriptions to maintain voice consistency across scenes
- Be specific: pitch, tone, accent, pacing, emotional quality, unique characteristics

## Understanding the Workflow
Your blueprint will be used in this process:
1. Character images will be generated from character descriptions for visual consistency
2. Character voice profiles will guide audio generation for vocal consistency
3. Scene videos with audio will be generated using:
   - imagePrompt (what's seen) + character reference images
   - audioPrompt (what's heard) + character voice profiles
   - videoPrompt (how it moves)
4. Angle videos with audio will use the main scene as reference
5. All clips with synchronized audio will be edited together

## Output Requirements

### 1. Title
Generate a compelling, concise title (3-8 words) that captures the video's essence.

### 2. Characters
Identify all main speaking characters. For EACH character, provide:

- **name**: Character identifier (e.g., "Hero", "Mentor", "Villain", "Sarah", "Dr. Chen")
  - Use clear, consistent names referenced in scenes
  - Should reflect their role or identity

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words) for generating consistent reference images. Include:
  - Physical appearance (age, gender, build, height)
  - Facial features and distinctive characteristics
  - Hair/head details (color, style, length)
  - Clothing/outfit (specific items, colors, style)
  - Accessories or props
  - Overall aesthetic and personality
  - Exact style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED voice description (100-150 words) for audio consistency. Must include:
  
  **MANDATORY VOICE ELEMENTS:**
  
  1. **Fundamental Characteristics (30-40 words)**
     - **Pitch**: Specific range (e.g., "deep baritone," "high soprano," "mid-range tenor," "warm alto")
     - **Tone Quality**: Texture (e.g., "smooth and velvety," "raspy and weathered," "bright and crisp," "soft and breathy")
     - **Volume/Projection**: Natural speaking level (e.g., "quiet and intimate," "strong and projecting," "moderate conversational")
     - **Age Indicator**: Vocal age (e.g., "youthful early 20s sound," "mature 40s voice," "elderly with slight tremor")
  
  2. **Accent & Speech Pattern (20-30 words)**
     - **Accent**: Specific regional or ethnic (e.g., "slight Southern drawl," "British RP," "New York accent," "neutral American," "no discernible accent")
     - **Pacing**: Speed of speech (e.g., "measured and deliberate," "quick and energetic," "slow contemplative")
     - **Rhythm**: Speech pattern (e.g., "staccato and precise," "flowing and melodic," "hesitant with pauses")
  
  3. **Emotional Quality & Personality (25-35 words)**
     - **Default Emotion**: Baseline feeling (e.g., "warmth and kindness," "cold authority," "nervous energy," "confident calm")
     - **Personality Traits**: How personality colors voice (e.g., "scholarly precision," "street-smart edge," "gentle compassion," "bitter cynicism")
     - **Distinctive Features**: Unique quirks (e.g., "slight lisp on 's' sounds," "tendency to trail off thoughtfully," "emphasizes last word of sentences," "clears throat before speaking")
  
  4. **Vocal Techniques & Expressiveness (15-25 words)**
     - **Expressiveness Level**: How animated (e.g., "highly expressive with wide range," "reserved with subtle shifts," "monotone with rare emotion")
     - **Breath Control**: Speaking style (e.g., "controlled steady breaths," "sharp inhales between thoughts," "sighs frequently")
     - **Articulation**: Clarity (e.g., "crisp enunciation," "mumbles slightly," "over-pronounces," "casual dropped endings")

**EXAMPLE VOICE PROFILES:**

**For Young Female Protagonist:**
"Mid-range soprano voice with bright, clear tone quality. Soft and slightly breathy when emotional, strengthens when confident. Youthful early-20s sound with subtle warmth. Neutral American accent with no regional markers. Moderate pacing that slows during vulnerable moments, quickens when excited. Flowing melodic rhythm with natural conversational cadence. Default emotional quality carries hopeful determination with underlying vulnerability. Personality shows through gentle compassion and quiet strength. Distinctive feature: slight upward inflection at end of important statements, showing both uncertainty and hope. Highly expressive with genuine emotional range, from whispered pain to clear joy. Controlled steady breathing with occasional trembling inhales during difficult moments. Crisp but natural articulation, never forced."

**For Gruff Older Mentor:**
"Deep baritone voice with weathered, slightly raspy tone from years of experience. Strong projecting quality but often speaks at moderate volume. Mature 50s-60s vocal age with authority and gravitas. Slight Southern drawl, more pronounced on certain words. Slow, measured pacing - every word deliberate and meaningful. Staccato rhythm with purposeful pauses for emphasis. Default emotional quality is stoic wisdom with hidden warmth beneath gruff exterior. Personality shows through no-nonsense directness and hard-earned kindness. Distinctive features: clears throat before important advice, slight gravelly catch on emotional words. Reserved expressiveness with subtle shifts - rare moments of emotion hit harder. Deep, controlled breaths between statements. Crisp enunciation despite casual delivery, drops some word endings in relaxed moments."

**For Nervous Young Professional:**
"Mid-range tenor voice with tight, slightly nasally tone from tension. Quiet to moderate volume, tends toward intimate conversational level. Youthful mid-20s sound with anxious energy. Neutral American accent with precise, almost over-careful pronunciation. Quick pacing that accelerates when nervous, with frequent self-corrections. Hesitant rhythm with um's, ah's, and mid-sentence pauses while thinking. Default emotional quality carries nervous energy mixed with eager intelligence. Personality shows through analytical precision and self-doubt. Distinctive features: tendency to trail off when unsure, nervous laugh after uncomfortable statements, speaks faster when explaining technical details. Highly expressive but in anxious ways - voice cracks under pressure, brightens with relief. Sharp quick inhales between thoughts, occasional held breath. Over-articulates to compensate for nervousness."

### 3. Scenes
Break down the story into ${Math.ceil(durationInSecs / 10)} to ${Math.ceil(durationInSecs / 7)} scenes.

For each scene, provide:

- **index**: Scene number (starting from 0)

- **charactersInTheScene**: Array of character names appearing/speaking in this scene
  - Use EXACT character names from Characters section
  - Include all visible AND speaking characters
  - Examples: ["Hero"], ["Hero", "Mentor"], ["Sarah", "Dr. Chen"]

- **imagePrompt**: EXTREMELY DETAILED visual description (100-200 words) for the scene image. Include:
  - Camera angle/shot type
  - Setting/Location details
  - Character positions and actions (reference by name - their images will be provided)
  - Action/Moment captured
  - Lighting and atmosphere
  - Visual details (colors, textures, environment)
  - Composition for ${aspectRatio}
  - Style matching "${style}"
  
  **Remember**: This creates a static image first, then animated. Describe as freeze-frame.

- **videoPrompt**: Detailed description (150-300 words) for animating the scene WITH SYNCHRONIZED AUDIO. This is CRITICAL as it includes both visual animation AND audio generation. Must include:
  
  **VISUAL ANIMATION (80-120 words):**
  - **Camera movements**: Specific motion (pan, tilt, zoom, dolly, orbit, static)
  - **Character movements**: Natural actions and gestures
  - **Environmental motion**: Atmospheric elements
  - **Motion intensity**: Keep cinematic and appropriate
  - **Timing**: Paced for 5-10 second clip
  
  **AUDIO DESCRIPTION (70-180 words):**
  - **Character Dialogue**: If characters speak:
    * Format: "AUDIO: [CharacterName] speaks, using their [key voice traits from voiceProfile]:"
    * Exact dialogue in quotes
    * Emotional delivery (e.g., "with trembling voice," "confidently," "whispering")
    * Pacing notes (pauses, emphasis, rhythm)
    * Example: "AUDIO: Sarah speaks, using her mid-range soprano with soft breathy quality: 'I can't do this anymore.' Delivery is quiet, vulnerable, voice breaking slightly on 'anymore' with trembling inhale before speaking."
  
  - **OR Narration**: If no characters speak (use sparingly):
    * Format: "AUDIO: Narrator with [voice description]: 'Text here.' Delivery notes."
    * Example: "AUDIO: Narrator with warm, mature female voice: 'Three years later, everything had changed.' Delivered thoughtfully with slight pause after 'later'."
  
  - **Ambient Sounds** (20-40 words): Environmental audio (e.g., "Soft rainfall pattering on windows, distant thunder rumbling low, city traffic muted in background")
  
  - **Music/Score** (20-40 words): Musical mood, instrumentation, tempo, emotional purpose (e.g., "Slow melancholic piano melody in minor key, subtle barely-there volume, supporting not overwhelming")
  
  - **Sound Effects** (10-20 words if relevant): Specific action sounds with timing (e.g., "Door creaking open at 3-second mark, echoing in empty hallway")
  
  **Critical**: This creates the complete animated scene with synchronized audio. The videoPrompt drives BOTH what viewers see AND what they hear. Prefer character dialogue over narration - only use narration for transitions or when no characters are present.

- **narration**: (OPTIONAL string) Brief scene context or transition (8-15 words)
  - Use sparingly - prefer character dialogue in videoPrompt
  - Only for transitions, scene-setting, or when no characters speak
  - Keep concise and impactful
  - Can be empty string "" if scene is fully dialogue-driven
  - Example: "Three years later, everything had changed."

- **angles**: (OPTIONAL array) Additional camera perspectives with synchronized audio

  Each angle includes:
  - **index**: Angle number (starting from 0)
  
  - **angleVideoPrompt**: Description (150-300 words) of the different camera angle WITH animation AND audio
    
    **VISUAL PORTION (80-120 words):**
    - How angle differs from main shot
    - What it emphasizes
    - Camera movement
    - Character/subject movements
    
    **AUDIO PORTION (70-180 words):**
    - Often similar to main scene audio but may emphasize different elements
    - If close-up on character, their voice more prominent/intimate in mix
    - If angle changes perspective (e.g., closer to window), ambient sounds shift accordingly (louder rain)
    - Music usually consistent with main scene
    - Include dialogue with voice profile references if characters speak
    
    **Example**: "Close-up on Sarah's face, camera slowly pushing in from medium close-up to extreme close-up over 6 seconds, emphasizing tears forming in eyes. Subtle head movement, slight downward gaze. AUDIO: Sarah speaks using her mid-range soprano with soft breathy quality: 'I can't do this anymore.' Her voice is more intimate and prominent in this close angle, vulnerability amplified. Soft breathing audible. Rain on windows quieter, more distant. Piano music subtle background, barely present."

## Critical Guidelines

1. **Voice Consistency is PARAMOUNT**: Every speaking moment in videoPrompt must reference the character's voiceProfile
2. **Dialogue-Driven**: Scenes should primarily use character dialogue in videoPrompt, not narration field
3. **Audio-Visual Integration**: videoPrompt contains BOTH animation AND audio - they must sync perfectly
4. **Layered Soundscape**: Within videoPrompt, combine dialogue + ambient + music for rich audio
5. **Emotional Delivery**: Specify exactly HOW each line is delivered
6. **Voice Evolution**: Character voices can show emotion but stay consistent with profile
7. **Natural Speech**: Include pauses, breaths, hesitations, emphasis in dialogue descriptions
8. **Spatial Audio**: Consider where sounds come from in the scene
9. **Music Supports**: Score should enhance emotion, never overpower dialogue
10. **Silence is Powerful**: Don't fill every moment - strategic quiet moments work

## Audio Integration Guidelines for videoPrompt

**STRUCTURE YOUR VIDEOPROMPT IN TWO PARTS:**

**Part 1 - Visual Animation (First):**
"Camera slowly pushes forward from wide shot to medium shot over 8 seconds, centering on Sarah. She sits at desk, shoulders slumped, fingers trembling as she grips coffee cup. Slight head movement, looking down then away. Rain visible through window behind her, drops sliding down glass. Soft ambient light from window, grey and cold."

**Part 2 - Audio Description (Second):**
"AUDIO: Sarah speaks, using her mid-range soprano voice with soft breathy quality: 'I can't do this anymore.' Delivery is quiet, vulnerable, voice breaking slightly on 'anymore' with trembling inhale before speaking. Measured pacing with pause after 'can't'. Ambient: Soft rainfall pattering on windows, distant thunder rumbling low, city traffic muted in background. Music: Slow melancholic piano melody in minor key, single sustained notes with long pauses between, subtle barely-there volume."

## Audio-Specific Guidelines for Premium Model

**CHARACTER DIALOGUE BEST PRACTICES:**
- Always start with: "[CharacterName] speaks, using their [key voice traits]:"
- Include exact dialogue in quotes
- Specify delivery: "with trembling voice," "confidently," "whispering urgently"
- Note pacing: "slow and measured," "quick and anxious," "with long pause after 'but'"
- Add micro-details: "voice cracks on 'love'," "emphasizes 'never'," "trails off on last word"

**MULTI-CHARACTER DIALOGUE:**

"Sarah speaks first, using her mid-range soprano with soft quality: 'Why didn't you tell me?' Delivered with hurt and confusion, voice slightly louder than her usual quiet tone. Brief pause. Then Marcus responds, using his deep baritone with warm tone: 'I wanted to protect you.' Delivered gently but firmly, measured pacing with emphasis on 'protect'."


**AMBIENT SOUND LAYERING:**
- Start with primary ambient (e.g., "Rain on windows, steady moderate intensity")
- Add secondary details (e.g., "Distant thunder every 15-20 seconds, low rumbling")
- Include subtle elements (e.g., "Faint wind whistling through window crack")
- Specify volumes (e.g., "Rain prominent but not overwhelming, thunder subtle backdrop")

**MUSIC INTEGRATION:**
- Describe genre/instrumentation: "Solo piano, classical style"
- Specify mood: "Melancholic and introspective"
- Note dynamics: "Starts quiet, builds slowly to moderate volume by scene end"
- State relationship to scene: "Supports emotional revelation, never overpowers dialogue"
- Include tempo: "Slow, about 60 BPM, giving space for words to land"

## Style-Specific Audio Considerations for "${style}":
${getAudioStyleGuidelines(style)}

## JSON Output Structure

Output ONLY valid JSON with NO additional text:

{
  "title": "string",
  "characters": [
    {
      "name": "string (clear, consistent identifier)",
      "imagePrompt": "string (150-250 words, highly detailed)",
      "voiceProfile": "string (100-150 words, extremely detailed voice description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName1", "CharacterName2"],
      "imagePrompt": "string (100-200 words, extremely detailed)",
      "videoPrompt": "string (150-300 words, animation + audio integrated)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, perspective + animation + audio integrated)"
        }
      ]
    }
  ]
}

Generate the complete video blueprint with synchronized audio now in valid JSON format only:`;
}

// Helper function for audio style guidelines
function getAudioStyleGuidelines(style: string): string {
  const audioStyleMap: Record<string, string> = {
    'Pixar 3D': `**AUDIO FOR ANIMATED STORYTELLING:**
- Character voices should be expressive and animated, but not caricatured
- Dialogue can be slightly more theatrical in delivery
- Ambient sounds can be stylized (e.g., cartoony wind whooshes, playful footsteps)
- Music: Orchestral, warm, emotionally supportive scores
- Sound effects: Clear, distinct, slightly exaggerated but not unrealistic
- Voice acting style: Professional animation voice work - clear, expressive, family-friendly
- Emotional beats: Music swells allowed, emotional voice delivery encouraged
- Silence: Less frequent - animation benefits from consistent audio engagement`,

    'Cinematic': `**AUDIO FOR FILM-QUALITY PRODUCTION:**
- Character voices should be naturalistic and realistic
- Dialogue delivery: Subtle, nuanced, film-actor quality performances
- Ambient sounds: Realistic environmental audio, layered and spatial
- Music: Cinematic orchestral scores or atmospheric soundscapes
- Sound effects: Authentic, high-fidelity, carefully placed
- Voice acting style: Method acting approach - lived-in, genuine performances
- Emotional beats: Underplayed emotion often more powerful than over-delivery
- Silence: Use strategic silence for dramatic impact
- Audio mixing: Professional film mix - dialogue clear, music supports, ambience creates world`,

    'Ghibli': `**AUDIO FOR GENTLE ATMOSPHERIC STORYTELLING:**
- Character voices should be soft, natural, contemplative
- Dialogue delivery: Gentle, unhurried, with natural pauses for reflection
- Ambient sounds: Nature-focused - wind, water, leaves, birds, gentle rain
- Music: Soft piano, strings, traditional instruments, Joe Hisaishi-inspired
- Sound effects: Subtle, organic, never harsh
- Voice acting style: Warm, genuine, focusing on emotional authenticity over theatrics
- Emotional beats: Let silence and ambient sounds carry emotion alongside dialogue
- Silence: Embrace quiet moments - wind, footsteps, breathing
- Overall: Peaceful, meditative soundscape supporting introspective moments`,

    'Anime': `**AUDIO FOR DRAMATIC ANIME STORYTELLING:**
- Character voices should be expressive, energetic, anime voice-acting style
- Dialogue delivery: Can be more dramatic and emotionally heightened
- Ambient sounds: Stylized to match anime aesthetic
- Music: J-pop, orchestral anime scores, electronic elements
- Sound effects: Anime-style whooshes, impacts, dramatic stings
- Voice acting style: Professional anime dubbing/original voice work - expressive range
- Emotional beats: Dramatic music swells, emotional voice cracks encouraged
- Action sequences: Dynamic sound effects, impactful hits, speed lines have audio equivalent
- Comedic moments: Can include anime-style sound effects (sweat drop sound, face fault)`,

    'Cyberpunk': `**AUDIO FOR FUTURISTIC NOIR ATMOSPHERE:**
- Character voices should have edge - urban, street-smart, or corporate cold
- Dialogue delivery: Fast-paced in action, slow and deliberate in tense moments
- Ambient sounds: City traffic, rain, neon buzzing, hologram flickers, machinery hums
- Music: Synthwave, electronic beats, dark ambient, industrial sounds
- Sound effects: High-tech UI sounds, robotic movements, gunshots with reverb
- Voice acting style: Noir-influenced - cynical edge, world-weary, or corporate smooth
- Technology sounds: Hologram glitches, digital artifacts, computer beeps
- Overall atmosphere: Rain-soaked, neon-lit urban soundscape with electronic undertones`,

    'Watercolor': `**AUDIO FOR ARTISTIC GENTLE STORYTELLING:**
- Character voices should be soft, artistic, introspective
- Dialogue delivery: Poetic, measured, allowing space between words
- Ambient sounds: Subtle, impressionistic rather than literal
- Music: Acoustic instruments, minimalist piano, soft strings, indie folk
- Sound effects: Delicate, artistic - brushstroke-like quality
- Voice acting style: Intimate, vulnerable, artistic sensibility
- Emotional beats: Subtle shifts, whispered intensity over shouting
- Silence: Abundant - embrace quiet contemplation
- Overall: Dreamlike, soft-edged audio matching watercolor visual aesthetic`
  };

  const styleLower = style.toLowerCase();
  for (const [key, value] of Object.entries(audioStyleMap)) {
    if (key.toLowerCase() === styleLower) {
      return value;
    }
  }

  return `**GENERAL AUDIO APPROACH:**
- Character voices should match the visual style's energy and tone
- Dialogue delivery should feel authentic to the style's world
- Ambient sounds should support the visual atmosphere
- Music should enhance emotional beats appropriately
- Sound effects should match the style's level of realism or stylization
- Voice acting should align with the style's performance expectations
- Use silence strategically based on style's pacing
- Layer audio elements to create rich, immersive soundscape`;
}

// Also export a dramatic version for premium
export function videoGenerationPromptPremiumDramatic(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating EMOTIONAL NARRATIVE videos with SYNCHRONIZED AUDIO for premium AI models (Veo 3.1).

## CRITICAL: This is a PREMIUM MODEL with Built-in Audio Generation

**AUDIO-FIRST APPROACH:**
- The model generates video AND audio simultaneously
- Focus on POWERFUL SPOKEN DIALOGUE that drives the emotional story
- Character voices must be EXTREMELY detailed for consistency across scenes
- Minimal narration - use character dialogue and conversations
- Include ambient sounds, music, and emotional delivery notes

## Your Task
Generate a complete video blueprint for a DEEPLY MOVING character-driven narrative with:
- Emotional dialogue that hooks viewers
- Consistent character voices across all scenes
- Cinematic audio-visual synchronization
- Professional sound design (dialogue + ambient + music)

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## EMOTIONAL NARRATIVE STRUCTURE (with Audio Focus)

### Narrative Arc Framework:
- **Devastating Hook (0-8s)**: SPOKEN cruel dialogue or harsh judgment
  * Must be CHARACTER DIALOGUE, not just narration
  * Example: Mother's voice, cold and dismissive: "She's too fat. No one will ever want her."
  
- **Backstory (8-25s)**: Dialogue revealing painful circumstances
  * Use conversations, confrontations, or inner monologue
  * Show character voices expressing hurt, rejection, determination
  
- **The Struggle (25-45%)**: Emotional dialogue during hardship
  * Desperate pleas, harsh words, quiet suffering
  * Voice breaking, trembling, or hardening
  
- **Hope Introduction (45-60%)**: Dialogue shift - unexpected kindness
  * Gentle words after cruelty
  * Voice softening, warmth appearing
  
- **Transformation (60-80%)**: Growing confidence in voice
  * Dialogue showing healing, bonding, new strength
  * Laughter returning, words of love spoken
  
- **Vindication (80-95%)**: Powerful spoken reversal
  * Shocked gasps, tearful apologies, or silent witnessing
  * Confident declarations, proven worth
  
- **Universal Truth (Final 5-10s)**: Wisdom delivered in memorable voice
  * Can use minimal narration here if needed
  * Or final character statement that resonates

${getBasePremiumStructure(durationInSecs, aspectRatio, style)}

Generate the complete emotional narrative video blueprint with synchronized audio now in valid JSON format only:`;
}

function getBasePremiumStructure(durationInSecs: number, aspectRatio: string, style: string): string {
  return `
## Output Requirements

### 1. Title
Compelling, emotionally charged title (6-12 words) hinting at transformation/vindication.

### 2. Characters
For EACH character (2-5 maximum):

- **name**: Role-based or actual name reflecting journey
- **imagePrompt**: 150-250 words visual description matching "${style}"
- **voiceProfile**: 100-150 words EXTREMELY DETAILED voice description:
  
  **Must Include:**
  - Pitch (deep baritone, high soprano, mid-range, etc.)
  - Tone quality (smooth, raspy, breathy, crisp, warm, cold)
  - Age sound (youthful 20s, mature 40s, elderly with tremor)
  - Accent (Southern drawl, British RP, neutral American, etc.)
  - Pacing (measured, quick, slow, hesitant)
  - Emotional baseline (warm kindness, cold authority, nervous energy)
  - Distinctive features (lisp, trailing off, emphasizes last words, clears throat)
  - Expressiveness level (highly expressive, reserved, monotone with rare emotion)

  **Example**: "Deep baritone voice with slightly raspy weathered tone suggesting years of hardship. Moderate volume, strong but not loud. Mature 50s vocal age with hard-earned authority. Slight Southern drawl more pronounced on emotional words. Slow deliberate pacing - every word matters. Default tone carries stoic wisdom with hidden warmth beneath gruff exterior. Distinctive: clears throat before important truths, voice softens almost imperceptibly when showing care. Reserved expressiveness - subtle shifts, but rare moments of emotion hit powerfully. Deep controlled breaths between statements. Crisp enunciation despite casual delivery."

### 3. Scenes
${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes for ${durationInSecs} seconds.

Each scene includes:

- **index**: Scene number
- **charactersInTheScene**: Array of character names
- **imagePrompt**: 120-250 words (emotion → character → environment → lighting → color → composition for ${aspectRatio})
- **videoPrompt**: 150-300 words - THIS IS CRITICAL (animation + audio integrated)

**VIDEOPROMPT STRUCTURE:**

**Part 1 - Visual Animation (80-120 words):**
- Camera movement (dolly, pan, zoom, static, etc.)
- Character animation (positioning, gestures, movements)
- Environmental motion (atmospheric elements)
- Motion pacing appropriate for emotion

**Part 2 - Audio Description (70-180 words):**

1. **Character Dialogue (Primary)** - 50-100 words if speaking:
   - Format: "AUDIO: [CharacterName] speaks, using their [key voice traits from profile]:"
   - Exact dialogue in quotes: "I never wanted this."
   - Emotional delivery: "Voice trembling with barely contained rage, speaking through clenched teeth"
   - Pacing specifics: "Long pause after 'never', emphasizing the word with slight voice crack"
   - Breath sounds: "Sharp inhale before speaking, exhale of resignation after"

   **OR for transitions/scene-setting:**
   - Format: "AUDIO: Narrator with [voice description]: 'Three years later.' Delivered [delivery notes]."
   - Use sparingly - prefer character dialogue

2. **Ambient Sounds** - 20-40 words:
   - Specific environmental audio: "Heavy rain drumming on metal roof, steady and overwhelming"
   - Volume levels: "Prominent but allowing dialogue to cut through clearly"
   - Spatial details: "Thunder rolling from left to right, distant but ominous"

3. **Music/Score** - 20-40 words:
   - Instrumentation: "Slow solo cello, minor key"
   - Tempo/dynamics: "Sustained notes with long silences between, building tension gradually"
   - Emotional purpose: "Underlining despair without overwhelming the raw dialogue"
   - Volume: "Subtle background, 20% of dialogue volume"

4. **Sound Effects** - 10-20 words if relevant:
   - Specific actions: "Suitcase dropped on wooden floor with heavy thud at 4-second mark"
   - Quality: "Echoing in empty room, emphasizing isolation"

**CRITICAL VIDEOPROMPT RULES:**
- ALWAYS reference character voiceProfile when they speak
- Specify EXACTLY how every line is delivered emotionally
- Layer audio: dialogue + ambient + music working together
- Use silence strategically - powerful emotional moments can be quiet
- For multiple speakers, specify turn-taking: "Sarah speaks first... Marcus responds after 2-second pause..."
- Match audio emotion to visual emotion precisely

- **angles**: Optional (use for 40-50% of key emotional scenes)
  Each angle has:
  - **index**: Angle number
  - **angleVideoPrompt**: 150-300 words (perspective + animation + audio integrated)
    - Visual: How angle differs, what it emphasizes, camera movement, character movements
    - Audio: Often similar to main scene but may emphasize different elements (close-up = more intimate voice, perspective shifts = ambient sound changes)

## Critical Guidelines for Emotional Narratives with Audio

1. **Dialogue-Driven Emotion**: Use spoken words in videoPrompt to convey the emotional journey
2. **Voice Consistency**: Every speaking moment in videoPrompt references the character's voiceProfile
3. **Emotional Delivery**: Specify trembling, breaking, confident, cold delivery for every line
4. **Integrated Audio-Visual**: videoPrompt contains both animation AND audio synchronized
5. **Layered Soundscape**: Combine dialogue + ambient + music within videoPrompt for rich emotional audio
6. **Audio-Visual Sync**: What's heard matches what's seen perfectly
7. **Strategic Silence**: Don't fill every moment - quiet can be powerful
8. **Voice Evolution**: Voices can show emotion but stay consistent with core profile
9. **Natural Speech**: Include pauses, breaths, hesitations, emphasis
10. **Ambient Mood**: Environmental sounds reinforce emotional atmosphere

## Audio-Specific Emotional Storytelling (in videoPrompt)

**OPENING HOOK AUDIO:**
- Harsh, cruel dialogue spoken coldly in videoPrompt: "AUDIO: Mother speaks with cold dismissive tone: 'She's too fat.'"
- Delivery notes: "Slow, deliberate, each word landing like a blow"
- Ambient: Silent or minimal - words should echo in emptiness
- Music: None or single low ominous note

**STRUGGLE AUDIO:**
- Voices breaking, trembling, or hardening
- Harsh environmental sounds: pouring rain, harsh wind, oppressive silence
- Minimal or dark music
- Breathing: labored, gasping, held breath

**HOPE AUDIO:**
- Voice softening: "AUDIO: His voice, unexpectedly gentle using warm baritone: 'You're safe here.'"
- Ambient: Softening - rain lessening, birds appearing, warmth entering
- Music: First hints of warmth - single piano notes, soft guitar
- Breathing: Easier, sighs of relief

**TRANSFORMATION AUDIO:**
- Voices growing confident, laughter appearing
- Dialogue showing bonding: genuine conversations, shared jokes
- Ambient: Pleasant - children playing, nature sounds, domestic warmth
- Music: Building hope - fuller instrumentation, major keys
- Sounds of life: cooking, working together, daily joy

**VINDICATION AUDIO:**
- Shocked gasps, stunned silence, tearful apologies
- Or confident declarations: voice strong, clear, unshakeable
- Ambient: May fade to emphasize the moment
- Music: Swelling triumphant or remaining quiet for impact
- Breathing: Sharp inhales of shock, trembling exhales

## Style Audio Guidelines: ${style}
${getAudioStyleGuidelines(style)}

## JSON Structure

{
  "title": "string (6-12 words, transformation focused)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (100-150 words, detailed voice description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (100-180 words)",
      "audioPrompt": "string (100-200 words, dialogue + ambient + music + effects)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (100-180 words)",
          "angleAudioPrompt": "string (60-120 words)"
        }
      ]
    }
  ]
}`
};

// Helper function to build enhanced prompt for premium models
export const buildPremiumVideoPrompt = (
  videoPrompt: string,
  charactersInTheScene: typeof sceneSchema.type['charactersInTheScene'],
  allCharacters: typeof characterSchema.type[]
): string => {
  if (!charactersInTheScene || charactersInTheScene.length === 0) {
    // No characters in this scene, return original prompt
    return videoPrompt;
  }

  // Find visual descriptions and voice profiles for characters in this scene
  const characterProfiles = charactersInTheScene
    .map((characterName) => {
      const character = allCharacters.find((c) => c.name === characterName);
      if (character) {
        return `CHARACTER: ${character.name}

VISUAL DESCRIPTION:
${character.imagePrompt}

VOICE PROFILE:
${character.voiceProfile}`;
      }
      return null;
    })
    .filter(Boolean);

  if (characterProfiles.length === 0) {
    // Characters listed but not found in allCharacters, return original prompt
    return videoPrompt;
  }

  // Build enhanced prompt with character profiles (visual + voice)
  const enhancedPrompt = `CHARACTERS IN THIS SCENE:
${characterProfiles.join('\n\n---\n\n')}

===

SCENE ANIMATION AND AUDIO:
${videoPrompt}

IMPORTANT: Use the visual descriptions above to identify and distinguish between characters in the scene image. Use the voice profiles to generate consistent character voices when they speak.`;

  return enhancedPrompt;
}
