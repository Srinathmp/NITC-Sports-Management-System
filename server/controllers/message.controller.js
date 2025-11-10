const transporter = require('../services/emailService');
const User = require('../models/User');
const Message = require('../models/Message');

exports.sendDirectMessage = async (req, res) => {
  try {
    console.log(req.user);
    return;
    const senderId = req.user.id; 
    const { recipientId, subject, body } = req.body;
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }
    const recipientEmail = recipient.email;
    const newMessage = new Message({
      sender_id: senderId,
      recipient_id: recipientId,
      subject: subject,
      body: body,
      status: 'Sent',
    });
    await newMessage.save();
    await transporter.sendMail({
      from: '"INSMS Admin" <noreply@insms.com>', // Sender address
      to: recipientEmail,                         // List of receivers
      subject: `New Message from INSMS: ${subject}`, // Subject line
      html: `
        <p>You have received a new message:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p>${body}</p>
        <hr>
        <p>Please log in to the INSMS portal to reply.</p>
      `, // HTML body
    });

    res.status(200).json({ msg: 'Message sent successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};