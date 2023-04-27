const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const api = async(req,res)=>{
  const { google } = require('googleapis');
  const OAuth2 = google.auth.OAuth2;
  const gmail = google.gmail('v1');
  
  // create OAuth2 client
  const oauth2Client = new OAuth2(
    YOUR_CLIENT_ID,
    YOUR_CLIENT_SECRET,
    YOUR_REDIRECT_URL
  );
  
  // set credentials
  oauth2Client.setCredentials({
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN,
    scope: ['https://www.googleapis.com/auth/gmail.modify']
  });
  
  // function to check for new emails
  async function checkForNewEmails() {
    const response = await gmail.users.messages.list({
      auth: oauth2Client,
      userId: 'me',
      q: 'is:unread'
    });
    
    // loop through messages
    response.data.messages.forEach(async (message) => {
      const msg = await gmail.users.messages.get({
        auth: oauth2Client,
        userId: 'me',
        id: message.id
      });
      
      // check if message has been replied to
      const headers = msg.data.payload.headers;
      let replied = false;
      headers.forEach((header) => {
        if (header.name === 'In-Reply-To') {
          replied = true;
        }
      });
      
      // if message has not been replied to, reply to it and label it
      if (!replied) {
        await gmail.users.messages.send({
          auth: oauth2Client,
          userId: 'me',
          requestBody: {
            threadId: msg.data.threadId,
            raw: Buffer.from(
              `To: ${msg.data.payload.headers[20].value}\r\n` +
              'Subject: Re: ' + msg.data.payload.headers[16].value + '\r\n\r\n' +
              `Thank you for your email. I am currently out of office and will not be able to respond until I return on ${dateOfReturn}. \r\n\r\n` 
            ).toString('base64')
          }
        });
        
        await gmail.users.messages.modify({
          auth: oauth2Client,
          userId: 'me',
          id: message.id,
          requestBody: {
            addLabelIds: [LABEL_ID],
            removeLabelIds: ['UNREAD']
          }
        });
      }
    });
  }
  
  // function to generate a random interval between 45 and 120 seconds
  function generateRandomInterval() {
    return Math.floor(Math.random() * (120 - 45) + 45) * 1000;
  }
  
  // call checkForNewEmails function at random intervals
  setInterval(checkForNewEmails, generateRandomInterval());
      
}


module.exports={api}