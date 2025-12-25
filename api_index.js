import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, style, size } = req.body;
  if(!prompt) return res.status(400).json({ status:"error", msg:"No prompt" });

  const api_key = "YOUR_RAPIDAPI_KEY";

  const apis = [
    // Flux BlackForest
    {
      url:"https://flux-ai-black-forest-labs-text-to-image-creation.p.rapidapi.com/fluxai",
      options:{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-rapidapi-host":"flux-ai-black-forest-labs-text-to-image-creation.p.rapidapi.com",
          "x-rapidapi-key":api_key
        },
        body: JSON.stringify({
          prompt,
          aspect_ratio:"1:1",
          width:512,
          height:512,
          prompt_upsampling:true
        })
      }
    },

    // SDXL
    {
      url:"https://sdxl.p.rapidapi.com/v1/txt2img",
      options:{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-rapidapi-host":"sdxl.p.rapidapi.com",
          "x-rapidapi-key":api_key
        },
        body: JSON.stringify({prompt})
      }
    },

    // Quick Flux Free
    {
      url:"https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
      options:{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-rapidapi-host":"ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
          "x-rapidapi-key":api_key
        },
        body: JSON.stringify({ prompt, style_id: style, size })
      }
    },

    // OmniInfer
    {
      url:"https://omniinfer.p.rapidapi.com/v2/txt2img",
      options:{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-rapidapi-host":"omniinfer.p.rapidapi.com",
          "x-rapidapi-key":api_key
        },
        body: JSON.stringify({
          negative_prompt:"nsfw, watermark, bad anatomy, low quality",
          sampler_name:"Euler a",
          batch_size:1,
          n_iter:1,
          steps:20,
          cfg_scale:7,
          seed:-1,
          height:512,
          width:512,
          model_name:"meinamix_meinaV9.safetensors",
          prompt
        })
      }
    },

    // AI Text-to-Image Generator API (other flux)
    {
      url:"https://ai-text-to-image-generator-api-ai-image-generator.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
      options:{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-rapidapi-host":"ai-text-to-image-generator-api-ai-image-generator.p.rapidapi.com",
          "x-rapidapi-key":api_key
        },
        body: JSON.stringify({ prompt, style_id: style, size })
      }
    }
  ];

  for(let api of apis){
    try{
      const response = await fetch(api.url, api.options);
      const data = await response.json();
      let img = data.image || data.image_url || (data.output && data.output[0]);
      if(img) return res.status(200).json({ status:"success", image:img });
    }catch(err){
      console.log("API fail:", err.message);
      continue;
    }
  }

  res.status(200).json({ status:"fail" });
}