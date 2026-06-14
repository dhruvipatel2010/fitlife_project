/* ============================================
   FitLife — ai-coach.js (AI Fitness Coach Engine)
   ============================================ */

const AICoach = {
  // Database of pre-defined responses
  responses: {
    chest: `
      <strong>Here is a Beginner Chest Workout:</strong><br>
      • <strong>Push-ups:</strong> 3 sets of 10-12 reps (bodyweight)<br>
      • <strong>Dumbbell Flat Press:</strong> 3 sets of 12 reps (moderate weight)<br>
      • <strong>Incline Dumbbell Press:</strong> 3 sets of 10 reps<br>
      • <strong>Chest Flys:</strong> 3 sets of 12 reps<br>
      <em>Rest 60-90 seconds between sets. Focus on controlling the movement!</em>
    `,
    legs: `
      <strong>Leg Day Routine (Strength & Hypertrophy):</strong><br>
      • <strong>Goblet Squats:</strong> 3 sets of 12 reps (heavy dumbbell)<br>
      • <strong>Walking Lunges:</strong> 3 sets of 20 steps (10 per leg)<br>
      • <strong>Dumbbell Romanian Deadlifts:</strong> 3 sets of 10 reps (focus on hamstrings)<br>
      • <strong>Calf Raises:</strong> 4 sets of 15 reps<br>
      <em>Keep your core tight and maintain a flat back.</em>
    `,
    cardio: `
      <strong>HIIT Cardio Blast (Fat Burn):</strong><br>
      • <strong>Jumping Jacks:</strong> 45 seconds work, 15 seconds rest<br>
      • <strong>High Knees:</strong> 45 seconds work, 15 seconds rest<br>
      • <strong>Burpees:</strong> 30 seconds work, 30 seconds rest<br>
      • <strong>Mountain Climbers:</strong> 45 seconds work, 15 seconds rest<br>
      <em>Repeat this circuit 3 to 4 times for a quick 20-minute workout!</em>
    `,
    nutrition: `
      <strong>Optimal Macros & Nutrition Guidelines:</strong><br>
      • <strong>Protein:</strong> 1.6g - 2.2g per kg of bodyweight (builds muscle)<br>
      • <strong>Carbohydrates:</strong> Fuels your workouts (complex carbs like oats, brown rice)<br>
      • <strong>Healthy Fats:</strong> Crucial for hormone support (avocado, nuts, olive oil)<br>
      <em>Tip: Drink at least 3-4 liters of water daily!</em>
    `,
    weight: `
      <strong>Caloric guidelines for weight goals:</strong><br>
      • <strong>To Lose Weight:</strong> Consume a 300-500 calorie deficit below your TDEE (Total Daily Energy Expenditure).<br>
      • <strong>To Gain Weight (Clean Bulk):</strong> Consume a 250-500 calorie surplus above your TDEE.<br>
      • Focus on high-protein foods to preserve lean muscle tissue.
    `,
    post: `
      <strong>Best Post-Workout Nutrition Options:</strong><br>
      • Whey protein shake with a banana (fast digestion)<br>
      • Grilled chicken breast with sweet potatoes<br>
      • Scrambled eggs on whole-wheat toast<br>
      • Greek yogurt with mixed berries and honey<br>
      <em>Aim to eat within 45 to 90 minutes after training.</em>
    `,
    motivation: `
      <strong>Stay Motivated & Consistent:</strong><br>
      • "Consistency beats intensity. It is better to work out 3 times a week every week than 6 times a week for only one week."<br>
      • Set small daily goals (e.g., walk 8,000 steps).<br>
      • Take progress photos instead of just checking the scale.<br>
      • Remember your "Why".
    `,
    default: `
      Hello! I am your <strong>FitLife AI Coach</strong>. 🤖<br>
      I can help you with:<br>
      • Custom workouts (try asking for <em>"chest workout"</em>, <em>"leg workout"</em>, or <em>"cardio routine"</em>)<br>
      • Nutrition advice (ask about <em>"macros"</em> or <em>"post-workout meal"</em>)<br>
      • Weight advice (ask about <em>"weight loss"</em> or <em>"muscle gain"</em>)<br>
      What are your fitness goals today?
    `
  },

  // Process user queries and find the best match
  getResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes('chest') || q.includes('push')) return this.responses.chest;
    if (q.includes('leg') || q.includes('squat') || q.includes('deadlift')) return this.responses.legs;
    if (q.includes('cardio') || q.includes('hiit') || q.includes('run') || q.includes('burn')) return this.responses.cardio;
    if (q.includes('nutrition') || q.includes('protein') || q.includes('macro') || q.includes('diet')) return this.responses.nutrition;
    if (q.includes('weight') || q.includes('lose') || q.includes('fat') || q.includes('bulk') || q.includes('gain')) return this.responses.weight;
    if (q.includes('post') || q.includes('after') || q.includes('meal') || q.includes('eat')) return this.responses.post;
    if (q.includes('motivat') || q.includes('consist') || q.includes('inspire') || q.includes('lazy')) return this.responses.motivation;
    
    return this.responses.default;
  },

  // Setup Chat UI Bindings
  init() {
    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSend');
    const chatContainer = document.getElementById('aiMessages');
    const suggestionChips = document.querySelectorAll('.ai-suggestion');

    if (!input || !chatContainer) return;

    // Send message function
    const sendMessage = (text) => {
      if (!text.trim()) return;

      // Add user bubble
      this.appendMessage(chatContainer, text, 'user');
      input.value = '';

      // Add typing indicator
      const typingIndicator = this.appendTypingIndicator(chatContainer);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Simulate AI typing delay
      setTimeout(() => {
        typingIndicator.remove();
        const responseText = this.getResponse(text);
        this.appendMessage(chatContainer, responseText, 'bot');
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1000 + Math.random() * 1000);
    };

    // Event listeners
    sendBtn?.addEventListener('click', () => sendMessage(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage(input.value);
    });

    // Suggestion chips
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sendMessage(chip.textContent);
      });
    });
  },

  // Helper to add bubble to container
  appendMessage(container, text, sender) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ${sender}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msg.innerHTML = `
      <div class="ai-bubble">
        ${text}
      </div>
      <div class="ai-msg-time">${time}</div>
    `;
    container.appendChild(msg);
  },

  // Helper to create typing bubble
  appendTypingIndicator(container) {
    const indicator = document.createElement('div');
    indicator.className = 'ai-msg bot ai-typing';
    indicator.innerHTML = `
      <div class="ai-bubble">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    `;
    container.appendChild(indicator);
    return indicator;
  }
};

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => AICoach.init());
