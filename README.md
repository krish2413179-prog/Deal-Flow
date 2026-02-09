<div align="center">
  <h1>🌊 DealFlow</h1>
  <h3>AI-Powered Autonomous Insurance Protocol</h3>
  <p>
    <b>Bridging the gap between on-chain liquidity and off-chain reality.</b>
  </p>
</div>

<br />

## DEPLOYED LINK

https://deal-flows.netlify.app/

## 💡 Inspiration
Traditional insurance is plagued by slow, manual claim verification and opaque rejection reasons. **dealFlow** solves this by acting as an **AI Forensic Auditor**. It connects a user's real-world evidence (photos of bills/receipts) with a company's on-chain liquidity and policy rules, creating a system where valid claims are paid out instantly, and invalid ones are rejected with clear, transparent reasons.

---

## 📸 How It Works

### 1. The "Brain" (Automation Engine)
*The core of dealFlow is a Make.com scenario that orchestrates the logic between Gmail, Google Gemini AI, and our Supabase ledger.*

![https://eu1.make.com/public/shared-scenario/2CgSk0vkgBS/integration-gmail-http]<img width="1742" height="863" alt="image" src="https://github.com/user-attachments/assets/b8a81243-5bdf-43c7-8c59-fbd54598b8dc" />



### 2. The Verdict (AI Forensic Auditor)


![insurancebot45@gmail.com]<img width="1116" height="674" alt="image" src="https://github.com/user-attachments/assets/c19c1089-a86f-473f-a55f-74f406f1dd37" />


---

## 🚀 Key Features

* **🤖 AI Forensic Auditor:** Uses computer vision (Google Gemini) to extract specific data from receipts (Merchant Name, Date, Total Amount) and cross-references it with the insurer's policy terms.
* **⚡ Automated Claim Settlement:** No human intervention required. If the data matches the policy, the claim is approved instantly.
* **🏢 Dual-Dashboard System:**
    * **Business Dashboard:** Real-time financial tracking (Total Locked, Paid Out, Available Balance).
    * **Consumer Dashboard:** Simple interface for users to track claim status.
* **📧 Zero-Friction Submission:** Users don't need to learn complex dApps to file a claim; they simply reply to an email with their evidence.

---

## ⚙️ How It Works (The Flow)

1.  **Business Onboarding:** An Insurance Agent registers on the **Business Dashboard** and funds their liquidity pool.
2.  **Claim Submission:** A user submits a claim via the **Consumer Portal** or by sending an email with an attachment (photo of the bill).
3.  **The "Watcher":** Our Make.com engine detects the new submission.
4.  **AI Analysis:** **Gemini AI** scans the image, acting as a forensic auditor. It extracts the **Bill Amount** and **Wallet Address** and checks against the specific **Company Policy** stored in Supabase.
5.  **The Verdict:**
    * **Approved:** The system updates the on-chain ledger and deducts the amount from the company's "Available Balance."
    * **Rejected:** The AI drafts a specific reply explaining exactly what is missing.
6.  **Notification:** The user receives an instant email notification with the verdict.

---

## 🛠️ Built With

* **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
* **AI Engine:** [Google Gemini API](https://deepmind.google/technologies/gemini/) (Vision & Text Processing)
* **Automation:** [Make.com](https://www.make.com/) (Orchestration)
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL & Real-time)
* **Web3:** [Ethers.js](https://docs.ethers.org/v5/) (Wallet connection)

---

## 📦 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  Clone the repo
    ```sh
    git clone [https://github.com/krish2413179-prog/dealFlow.git](https://github.com/krish2413179-prog/dealFlow.git)
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Start the development server
    ```sh
    npm run dev
    ```

---

## 🔮 What's Next for dealFlow
* **Smart Contract Integration:** Moving the ledger from Supabase to a fully decentralized Smart Contract on Polygon/Ethereum.
* **Fraud Detection 2.0:** Implementing advanced metadata analysis to detect Photoshop-edited receipts.
* **Multi-Chain Support:** Allowing payouts in USDC, ETH, or MATIC.

---

## 👥 Team
* **[Krish Sharma]** - Full Stack & Automation


---

> **Note to Judges:** The `Make.com` scenario JSON is included in the `/automation` folder for review.
