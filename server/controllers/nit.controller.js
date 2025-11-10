const asyncHandler = require('express-async-handler');
const NIT = require('../models/nit.model');
const AuditLog = require('../models/auditLog.model');
const transporter = require('../services/emailService');

const registerNIT = asyncHandler(async (req, res) => {
  const { nitName, nitCode, nitLoc, adminEmail } = req.body;
  const exists = await NIT.findOne({ nitName });
  if (exists) {
    res.status(400);
    throw new Error('NIT already registered');
  }
  const nit = await NIT.create({ name: nitName, code: nitCode, location: nitLoc, adminEmail: adminEmail });
  res.status(201).json(nit);
});

const listPendingNITs = asyncHandler(async (req, res) => {
  const list = await NIT.find({ status: 'Pending' });
  res.json(list);
});

const updateNITStatus = asyncHandler(async (req, res) => {
  try {
    const { code } = req.params;
    const { status, isHost } = req.body;
    const nit = await NIT.find({ code: code });
    if (!nit) { res.status(404); throw new Error('NIT not found'); }
    nit[0].status = status;
    nit[0].isHost = isHost;
    await transporter.sendMail({
      from: '"INSMS Admin" <noreply@insms.com>', // Sender address
      to: nit[0].adminEmail,                         // List of receivers
      subject: `Status Update`, // Subject line
      replyTo:"commonadmin@insms.com",
      html: 
      `
        <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f8fafc;
        padding: 25px;
        border-radius: 10px;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e2e8f0;
      ">
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin: 0;">🏛️ Inter-NIT Sports Management System</h2>
          <p style="color: #475569; font-size: 14px;">Official Notification</p>
        </div>

        <!-- Message Content -->
        <div style="color: #0f172a; font-size: 15px; line-height: 1.6;">
          <p><strong style="color:#2563eb;">From Common-Admin:</strong></p>
          <p><strong>Name:</strong> ${nit[0].name}</p>
          <p><strong>Code:</strong> ${nit[0].code}</p>
          <p><strong>Host NIT:</strong> ${nit[0].isHost ? "Yes ✅" : "No ❌"}</p>
          <br />
          <p><strong>Registration Status:</strong>
            <span style="color: ${
              status === "Approved"
                ? "#16a34a"
                : status === "Rejected"
                ? "#dc2626"
                : "#ca8a04"
            };">
              ${status}
            </span>
          </p>
          <p>Please log in to the <a href="https://insms.in" style="color: #2563eb; text-decoration: none; font-weight: 500;">INSMS Portal</a> to reply.</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          <p style="font-size: 13px; color: #64748b;">
            © ${new Date().getFullYear()} INSMS | Inter-NIT Sports Management System
          </p>
        </div>
      </div>
      `, // HTML body
    });
    await nit[0].save();
    await AuditLog.create({ action: 'Approve', user_id: req.user._id, entity: 'NIT', entity_id: nit[0]._id, details: `Status set to ${status}` });
    res.json(nit[0]);
  } catch (error) {

  }
});

module.exports = { registerNIT, listPendingNITs, updateNITStatus };