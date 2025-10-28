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


