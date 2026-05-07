const FAQ = require('@models/FAQ');
const response = require('../responses');

const DEFAULT_FAQ_PAGE = {
  type: 'faq_page',
  categories: [
    {
      categoryName: 'Payments & Deposits',
      order: 0,
      items: [
        { question: 'How does the deposit system work?', answer: 'ClinicalCore allows you to set granular deposit requirements for any clinical procedure. Funds are held in a secure escrow until the appointment is confirmed or completed.', order: 0 },
        { question: 'Can deposits be refunded?', answer: 'Yes. Admin users can process full or partial refunds through the financial dashboard. All transactions are logged with absolute audit integrity.', order: 1 },
        { question: 'What happens after repeated reschedules?', answer: 'The system can be configured to automatically trigger higher deposit requirements for clients with a history of three or more reschedules within a 30-day window.', order: 2 },
      ],
    },
    {
      categoryName: 'Cancellations & Behaviour',
      order: 1,
      items: [
        { question: 'How does the cancellation policy work?', answer: "Operators can define specific \"grace periods.\" Cancellations outside this window can trigger automatic fee processing according to your clinic's legal terms.", order: 0 },
        { question: 'Can clients reschedule themselves?', answer: 'Through the patient portal, clients can reschedule based on real-time availability, provided they are outside the restricted cancellation window.', order: 1 },
      ],
    },
    {
      categoryName: 'Staff & Roles',
      order: 2,
      items: [
        { question: 'Is pricing per staff member?', answer: 'No. ClinicalCore uses a performance-based pricing model that scales with your infrastructure usage, not your headcount. Add as many users as you need.', order: 0 },
        { question: 'How do staff permissions work?', answer: 'Granular Role-Based Access Control (RBAC) allows you to restrict access to financial data, patient records, or system configuration at the individual level.', order: 1 },
      ],
    },
    {
      categoryName: 'Data & Security',
      order: 3,
      items: [
        { question: 'Who owns the client list?', answer: 'You do. ClinicalCore acts strictly as a data processor. Your patient data is isolated in your dedicated cloud partition and remains your property at all times.', order: 0 },
        { question: 'Can I export my data?', answer: 'Data portability is a core pillar of our system. You can export clinical records, financial logs, and inventory data in CSV or encrypted JSON format at any time.', order: 1 },
      ],
    },
    {
      categoryName: 'Pricing & Billing',
      order: 4,
      items: [
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and bank transfers. Payment is processed securely through Stripe.', order: 0 },
        { question: 'Can I change my plan anytime?', answer: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately with pro-rated billing.', order: 1 },
      ],
    },
    {
      categoryName: 'Onboarding & Migration',
      order: 5,
      items: [
        { question: 'How long does onboarding take?', answer: 'Most clinics are fully operational within 2-3 business days. We provide dedicated onboarding support and training.', order: 0 },
        { question: 'Can you migrate my existing data?', answer: 'Yes. Our team will help migrate your client data, appointment history, and other records from your current system at no extra cost.', order: 1 },
      ],
    },
    {
      categoryName: 'Fresha / Clee / Kitomba',
      order: 6,
      items: [
        { question: 'Why would I move from Fresha?', answer: 'Fresha is a consumer-market platform with limited flexibility for aesthetic clinics. Clee is an operating system that also includes a marketplace. The difference is that Fresha is built for mass consumers, Clee is built for clinic operators who need granular control, advanced financial tools, and sophisticated client management.', order: 0 },
        { question: 'What about timely?', answer: 'Timely is a competent general-purpose scheduler. It lacks our software stack of the level a serious aesthetic business needs. Beyond scheduling, Clee offers deposit automation, RBAC, automated checkout recovery, integrated inventory management at the product level. Clee is purpose-built for your space.', order: 1 },
      ],
    },
  ],
};

const DEFAULT_CONSULT_SECTION = {
  type: 'consult_section',
  categories: [
    {
      categoryName: 'General',
      order: 0,
      items: [
        { question: 'How does pricing work?', answer: 'Clee uses transparent, scalable pricing—no hidden fees, no surprise charges. Choose from Solo, Signature, or Scale. Designed, full-team controls.', order: 0 },
        { question: 'Do I need marketing experience?', answer: 'Clee comes with high-performing campaigns already written and automated. No copywriting, no agency, no setup—just results.', order: 1 },
        { question: 'How are last-minute slots filled?', answer: 'Two ways, both automatic. You waitlist clients can self-add into the moment a slot opens. Or Clee broadcasts to your client base automatically to fill the gap—no manual outreach, no chasing, just bookings.', order: 2 },
        { question: 'Who is Clee for?', answer: "Skin clinics, salons, spas, solo, brick & mortar, team, multi-location, owner-it doesn't matter. If you take bookings, if you operate with clients, Clee is designed for you. Clee scales with you.", order: 3 },
        { question: 'What can I track?', answer: 'Clee tracks revenue, bookings, repeat clients, and individual staff performance. Real-time dashboards, better visibility, smarter decisions. All automated.', order: 4 },
        { question: 'Can I try it first?', answer: 'Yes. Start with a free trial—no credit card. Set it up and test everything. Onboard. Fill a calendar and watch your business run at a whole new level.', order: 5 },
      ],
    },
  ],
};

module.exports = {
  getFaq: async (req, res) => {
    try {
      const { type } = req.params;
      let faq = await FAQ.findOne({ type });
      if (!faq || !faq.categories || faq.categories.length === 0) {
        const defaultData = type === 'faq_page' ? DEFAULT_FAQ_PAGE : DEFAULT_CONSULT_SECTION;
        faq = await FAQ.findOneAndUpdate(
          { type },
          { $set: defaultData },
          { new: true, upsert: true },
        );
      }
      return response.ok(res, { data: faq });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateFaq: async (req, res) => {
    try {
      const { type } = req.params;
      const { categories } = req.body;
      const faq = await FAQ.findOneAndUpdate(
        { type },
        { categories },
        { new: true, upsert: true, runValidators: true },
      );
      return response.ok(res, { message: 'FAQ updated successfully', data: faq });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
