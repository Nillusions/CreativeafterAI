// =========================================
// Fieldnotes Manifest & Article Content Store
// =========================================

window.FIELDNOTES_DATA = [
    {
        id: "director-mindset",
        slug: "director-mindset",
        title: "The Director Mindset: Why the Best Prompters Think Like Filmmakers",
        subtitle: "Moving beyond transactional one-line queries into intentional cinematic worldbuilding.",
        excerpt: "Why asking AI for 'a modern poster' fails, and how adopting the four disciplines of film directing transforms generic AI responses into stunning creative work.",
        date: "September 18, 2024",
        readTime: "6 min read",
        category: "Prompts",
        tags: ["Prompts", "Strategy", "Creative Direction"],
        color: "#C8E64E",
        author: {
            name: "Alen Thomas",
            role: "Founder, Creative after AI",
            avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23C8E64E'/><text x='50%' y='58%' font-size='42' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%230e0e0e'>AT</text></svg>"
        },
        coverImage: "fieldnotes-data/images/director-mindset.jpg",
        content: `
            <p class="article-lead">
                Every week, someone sends me an AI generation and says: <em>"It looks cool, but it feels so… AI."</em> You know the feeling: overly glossy skin, plastic textures, symmetrical faces staring blankly at center frame, and that unmistakable aura of generic high-budget stock footage.
            </p>

            <p>
                The problem isn't the model. Midjourney v6, Stable Diffusion 3, Claude 3.5 Sonnet, and GPT-4o have consumed petabytes of human art, cinema, and photography. The problem is that most people approach generative AI like an executive barking orders to an unpaid intern: <em>"Make me a futuristic poster of a woman in Tokyo."</em>
            </p>

            <p>
                If a movie director walked onto a soundstage and shouted that at their cinematographer, gaffer, costume designer, and actors, the production would implode. Film directors don't demand results; they establish worlds.
            </p>

            <div class="article-callout">
                <div class="callout-icon">✦</div>
                <div class="callout-body">
                    <strong>The Core Rule:</strong> AI is not a search engine, and it is not an artist. It is a hyper-literal orchestra awaiting a conductor. The precision of your world dictates the quality of the performance.
                </div>
            </div>

            <h2>The Four Walls of the Director's Frame</h2>

            <p>
                When a director steps onto a set, they never think in single words. They decompose reality into four distinct technical dimensions:
            </p>

            <figure class="article-figure">
                <img src="fieldnotes-data/images/director-inline.jpg" alt="Creative Direction Workflow for Generative AI" class="article-image">
                <figcaption>Figure 1: The four-stage creative direction pipeline for prompting AI models.</figcaption>
            </figure>

            <h3>1. Character & Motivation</h3>
            <p>
                Never say "a tired businessperson." That triggers the most statistically average stock photo of a man rubbing his temples in front of a laptop. Instead, tell the model their emotional baggage:
            </p>

            <div class="prompt-box">
                <div class="prompt-header">
                    <span class="prompt-tag">Direction Example</span>
                    <button class="prompt-copy-btn" onclick="copyPromptCard(this)">Copy</button>
                </div>
                <div class="prompt-content">
                    A candid editorial portrait of an exhausted independent coffee roaster at 5:15 AM, flour and coffee dust smudged on forearms, lean posture leaning against a stainless steel espresso machine, eyes bloodshot but determined, wearing a faded navy canvas apron.
                </div>
            </div>

            <h3>2. Lighting as Emotion</h3>
            <p>
                Light is narrative. "Studio lighting" gives you flat, uninspired catalogue photos. Direct the light sources like a master gaffer:
            </p>
            <ul>
                <li><strong>Golden hour rim light:</strong> Adds nostalgia, warmth, and cinematic separation from the background.</li>
                <li><strong>Practicals only:</strong> Neon signs reflecting on wet asphalt create noir tension and high-contrast shadows.</li>
                <li><strong>Diffused overcast ambient:</strong> Soft, Scandinavian melancholia with neutral color tones.</li>
            </ul>

            <blockquote class="article-quote">
                "Light is not merely illumination. Light is time, psychology, and geography condensed into photons."
            </blockquote>

            <h3>3. The Lens and Focal Plane</h3>
            <p>
                AI models understand optics better than most humans realize. When you specify lens physics, you eliminate the warped perspective that gives away amateur generations:
            </p>
            <ul>
                <li><strong>35mm anamorphic, f/2.0:</strong> Authentic cinema aspect ratio, horizontal blue lens flares, gentle edge softness.</li>
                <li><strong>85mm portrait prime:</strong> Flattering facial compression, creamy bokeh, zero perspective distortion.</li>
                <li><strong>24mm wide angle, low angle:</strong> Imposing scale, heroic stature, environmental context.</li>
            </ul>

            <h2>Stop Prompting. Start Directing.</h2>
            <p>
                Next time you open your generative studio, don't ask for the output. Picture the set. Where is the key light? What lens did the cinematographer mount? What happened five seconds before this frame, and what will happen five seconds after?
            </p>

            <p>
                The creatives who survive and thrive in this landscape aren't the ones who type the fastest. They are the ones with a vivid, uncompromising directorial eye.
            </p>
        `
    },
    {
        id: "node-pipelines",
        slug: "node-pipelines",
        title: "Beyond the Prompt: Designing Repeatable Node-Based AI Pipelines",
        subtitle: "Why chat windows are dead ends for commercial creative production, and how node graphs win.",
        excerpt: "A single prompt box is fine for ideation, but commercial work demands consistency, version control, and modularity. Here is how node-based systems change the game.",
        date: "September 12, 2024",
        readTime: "8 min read",
        category: "Workflows",
        tags: ["Workflows", "Systems", "Automation"],
        color: "#fda121",
        author: {
            name: "Alen Thomas",
            role: "Founder, Creative after AI",
            avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23fda121'/><text x='50%' y='58%' font-size='42' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%230e0e0e'>AT</text></svg>"
        },
        coverImage: "fieldnotes-data/images/node-pipelines.jpg",
        content: `
            <p class="article-lead">
                The single-prompt chat interface is the greatest onboarding trick in tech history. It made AI feel accessible to everyone. But for professional art directors, designers, and creative technologists, the chat box is an architectural dead end.
            </p>

            <p>
                Why? Because real creative work is non-linear. You need to tweak the color palette without re-rolling the facial expression. You need to test 20 headlines against the same layout without redrawing the character. When you re-prompt a chat model, it rolls an entirely new universe every single time.
            </p>

            <h2>The Rise of Node-Based Computational Workflows</h2>
            <p>
                In 3D software like Houdini, Blender, and Unreal Engine, node-based procedural workflows won decades ago. Now, tools like ComfyUI, Dify, Make, and custom LLM node systems are doing the exact same thing for generative AI.
            </p>

            <figure class="article-figure">
                <img src="fieldnotes-data/images/node-inline.jpg" alt="Generative AI Pipeline Architecture" class="article-image">
                <figcaption>Figure 2: A modular generative AI node pipeline decoupling prompt routing, latent synthesis, and refinement.</figcaption>
            </figure>

            <h3>Why Modular Nodes Win Every Time:</h3>
            <ol>
                <li><strong>State Decoupling:</strong> Keep the character pose fixed (ControlNet OpenPose node) while swapping the clothing texture (Inpainting node) with zero drift.</li>
                <li><strong>Automated Fallbacks:</strong> If a visual generation fails quality criteria (e.g. CLIP score below 0.8), route it automatically to an upscaler and secondary prompt corrector.</li>
                <li><strong>Reproducibility:</strong> You can export a node workflow as a JSON graph, check it into Git, and run it across an entire agency team with identical results.</li>
            </ol>

            <div class="article-callout">
                <div class="callout-icon">⚙</div>
                <div class="callout-body">
                    <strong>Key Architecture:</strong> Input Prompts → Concept Dissection LLM → Latent Diffusion Generation → Vector Reference Matcher → Tile Upscaler & Color Grade Node.
                </div>
            </div>

            <blockquote class="article-quote">
                "Amateurs chase lucky seeds. Professionals build repeatable engines."
            </blockquote>

            <h2>How to Start Building Your Own Pipelines</h2>
            <p>
                You don't need to be a Python engineer to start thinking in nodes. Begin by charting your existing creative workflow on a whiteboard. Break your process down into discrete, atomic transformations:
            </p>
            <ul>
                <li><strong>Node A (Extraction):</strong> Scan client brand guidelines for hex codes and typography rules.</li>
                <li><strong>Node B (Ideation):</strong> Generate 10 variations of conceptual visual metaphors based on the brief.</li>
                <li><strong>Node C (Drafting):</strong> Synthesize low-resolution thumbnail layouts.</li>
                <li><strong>Node D (Finishing):</strong> Render selected thumbnails at 4K with matched studio lighting.</li>
            </ul>

            <p>
                Once you see your creative process as a graph rather than a conversation, you gain superpowers no chat prompt could ever provide.
            </p>
        `
    },
    {
        id: "creative-taste",
        slug: "creative-taste",
        title: "The Curation Imperative: Why Creative Taste is the Last Defensible Moat",
        subtitle: "When generation costs drop to zero, value shifts entirely to discernment, curation, and taste.",
        excerpt: "When anyone with an internet connection can conjure a thousand photorealistic images in three minutes, making images ceases to be valuable. Selecting them becomes everything.",
        date: "August 28, 2024",
        readTime: "5 min read",
        category: "Philosophy",
        tags: ["Philosophy", "Design", "Future of Work"],
        color: "#a09bf3",
        author: {
            name: "Alen Thomas",
            role: "Founder, Creative after AI",
            avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23a09bf3'/><text x='50%' y='58%' font-size='42' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%230e0e0e'>AT</text></svg>"
        },
        coverImage: "fieldnotes-data/images/creative-taste.jpg",
        content: `
            <p class="article-lead">
                In 1839, the French painter Paul Delaroche first saw a daguerreotype photograph and famously proclaimed: <em>"From today, painting is dead."</em> He was wrong, of course. Painting didn't die—it was liberated from the tedious obligation of literal representation, giving birth to Impressionism, Cubism, and Abstract Expressionism.
            </p>

            <p>
                We are standing in another 1839 moment.
            </p>

            <p>
                For centuries, creative value was pegged directly to manual friction: the hours required to mix oil paints, to keyframe a 3D spline, or to painstakingly mask a photo in Photoshop. Generative AI has systematically dropped manual production friction to near zero.
            </p>

            <figure class="article-figure">
                <img src="fieldnotes-data/images/taste-inline.jpg" alt="The Taste Matrix: Signal vs Noise in Generative Output" class="article-image">
                <figcaption>Figure 3: The Curation Matrix—mapping human creative discernment against raw AI output.</figcaption>
            </figure>

            <h2>The Abundance Paradox</h2>
            <p>
                Economics teaches us that when a resource becomes infinite, its price collapses to zero, and whatever remains scarce captures all the value.
            </p>

            <div class="article-callout">
                <div class="callout-icon">✦</div>
                <div class="callout-body">
                    <strong>What is infinite today:</strong> Variations, pixels, words, compositions, drafts, rendered frames.<br>
                    <strong>What is critically scarce:</strong> Discernment, perspective, emotional resonance, and creative taste.
                </div>
            </div>

            <p>
                The internet is already filling up with synthetic slop: generic vector illustrations with eight fingers, cookie-cutter LinkedIn posts, and uninspired vaporwave visuals. The barrier to entry has been demolished, but the barrier to quality has never been higher.
            </p>

            <blockquote class="article-quote">
                "Taste is not what you create; it is what you refuse to accept."
            </blockquote>

            <h2>Developing Taste in the Age of Synthesis</h2>
            <p>
                How do you train an irreplacable creative eye when machines can render anything?
            </p>
            <ul>
                <li><strong>Look outside the algorithm:</strong> If your visual diet is whatever Midjourney feeds your Twitter timeline, your output will look like everyone else's. Study print typography from 1968, Japanese textile patterns, brutalist architecture, and analog cinema.</li>
                <li><strong>Become a ruthless editor:</strong> Generate 100 iterations, discard 99. The mark of a master creative isn't what they show the client—it's the mountain of mediocrity they had the discipline to throw in the trash.</li>
                <li><strong>Inject human friction:</strong> Pair raw AI generation with tactile human touch—custom typography, risograph printing, physical textures, and intentional imperfections.</li>
            </ul>

            <p>
                AI will not take your job. A creative with superior taste, powered by AI, will.
            </p>
        `
    },
    {
        id: "latent-canvas",
        slug: "latent-canvas",
        title: "The Latent Canvas: Achieving Visual Style Consistency Across Multimodal AI",
        subtitle: "Mastering character identity, color grading, and textural fidelity across continuous creative sequences.",
        excerpt: "The biggest bottleneck in AI storytelling has always been consistency. Here is the technical breakdown of how to lock in color palettes, character faces, and world textures.",
        date: "August 15, 2024",
        readTime: "7 min read",
        category: "Techniques",
        tags: ["Techniques", "Visual Art", "Consistency"],
        color: "#F2A2E8",
        author: {
            name: "Alen Thomas",
            role: "Founder, Creative after AI",
            avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23F2A2E8'/><text x='50%' y='58%' font-size='42' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%230e0e0e'>AT</text></svg>"
        },
        coverImage: "fieldnotes-data/images/latent-canvas.jpg",
        content: `
            <p class="article-lead">
                Anyone can generate one breathtaking still frame with an AI generator. But the moment you try to create a second image featuring the exact same character in a different lighting setup, the face morphs, the haircut shifts, and the world dissolves into visual inconsistency.
            </p>

            <p>
                Solving this "consistency dilemma" is the holy grail of multimodal storytelling. Here are the four tested strategies we use across client campaigns and editorial projects.
            </p>

            <h2>1. Seed Anchoring and Fixed Character Embeddings</h2>
            <p>
                Every generation begins with random Gaussian noise driven by a numerical seed. When iterating on character details, lock the seed value and use weighted negative prompting to isolate variables:
            </p>

            <div class="prompt-box">
                <div class="prompt-header">
                    <span class="prompt-tag">Seed Strategy</span>
                    <button class="prompt-copy-btn" onclick="copyPromptCard(this)">Copy</button>
                </div>
                <div class="prompt-content">
                    --seed 4829104 --cref [Character Reference URL] --cw 80 --no face distortion, plastic skin, oversaturation
                </div>
            </div>

            <h2>2. Palette Discipline Through Color Temperature Tokens</h2>
            <p>
                Rather than letting the model pick its own color gamut, enforce strict palette tokens across your entire sequence:
            </p>
            <ul>
                <li><strong>Cool split-complementary:</strong> Specify <em>"deep teal shadows (#0D1B2A), warm amber tungsten highlights (#FFB703), desaturated midtones"</em>.</li>
                <li><strong>Film stock references:</strong> Mention specific emulsions like <em>"Kodak Portra 400 with fine silver halide grain"</em> or <em>"Fujifilm Superia 800 with emerald green shadow tint"</em>.</li>
            </ul>

            <blockquote class="article-quote">
                "Style consistency isn't an accident of probability; it is the discipline of constraining the latent space."
            </blockquote>

            <h2>3. Multi-Pass Latent Inpainting</h2>
            <p>
                Never regenerate a whole canvas when only one element drifted. Use inpainting masks to lock 85% of the frame and re-roll only the gesture, prop, or gaze direction. This preserves atmospheric perspective and depth of field across sequential panels.
            </p>

            <p>
                By systematically chaining character references, color constraints, and inpainting passes, you transform sporadic visual rolls into a coherent, publication-ready visual language.
            </p>
        `
    }
];
