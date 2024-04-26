export type actualMessage = {
    comment: string;
    post?: string;}

export type ExampleMessage = {
    comment: string;
    post?: string;
    output: {[key: string]: string};
}

export type CategorizeInput = {
    actual: actualMessage;
    examples: ExampleMessage[];
    sysprompt: string;
    labels:string[];
}


export async function categorize(input: CategorizeInput): Promise<string> {
    // Format the input into a suitable format for the POST request
    const rawPrompt = formatPrompt(input);
    const body = {
        model: "meta-llama/Llama-3-70b-chat-hf",
  max_tokens: 30,
  temperature: 0.05,
  top_p: 0.7,
  top_k: 50,
  repetition_penalty: 1,
  stream_tokens: false,
  stop: [
    "<|eot_id|>"
  ],
  "messages": [
    {
        "content":rawPrompt,
      "role": "user"
    }]
    }
    try {
        // Perform the POST request using fetch API
        const response = await fetch('https://api.together.xyz/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.TOGETHER_API_KEY
            },
            body: JSON.stringify(body)
        });

        // Check if the request was successful
        if (!response.ok) {
            console.log(await response.text());
            throw new Error('Network response was not ok');
        }
        
        // Parse the JSON response
        const data = await response.json();
       

        // Return the appropriate field or the whole data as needed
        return JSON.parse(data.choices[0].message.content); // Assuming the server responds with an object that includes a 'result' field
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Rethrow the error if you want to handle it further up the call stack
    }
}

function formatPrompt(input: CategorizeInput): string {
    
    const rawprompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>


    ${input.sysprompt}. Only respond with ${input.labels.join(", ")}.<|eot_id|><|start_header_id|>user<|end_header_id|>


    give the necessary tags for email content

    ${input.examples.map((example,idx) => `---example ${idx}
    ${example.post?`POST\n${example.post}\n`:""}
    COMMENT
    ${example.comment}
    ${JSON.stringify(example.output)}
    `).join("\n")}
    
    ${input.actual.post?`POST\n${input.actual.post}\n`:""}
    COMMENT
    ${input.actual.comment}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
    `
    return rawprompt;
}

