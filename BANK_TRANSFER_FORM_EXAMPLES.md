# Bank Transfer Form Examples - eBanking App

## 📝 Bank Transfer Form Field Examples

When using the bank transfer feature in the eBanking app, here are realistic examples of what to enter in each field:

### 🏦 **Example 1: Transfer to BIAT Bank**

**Transfer Amount:**
- Amount: `500` TND
- Equivalent: ~`160` USD (at 1 TND = 0.32 USD)

**Bank Details:**
- **Selected Bank**: `BIAT` (Banque Internationale Arabe de Tunisie)
- **RIB Number**: `20041000123456789012` 
  - Format: 20 digits for Tunisian RIB
  - First 4 digits (2004) = BIAT bank code
  - Next 4 digits (1000) = Branch code
  - Last 12 digits = Account number

**Recipient Information** (Auto-filled as "Self Transfer"):
- **Recipient Name**: `Ahmed Ben Ali`
- **Account Number**: `000123456789`

**Additional Details:**
- **Description**: `Monthly salary deposit`
- **Note**: `Transfer from my BIAT account to eBanking wallet`

---

### 🏦 **Example 2: Transfer from STB Bank**

**Transfer Amount:**
- Amount: `1000` TND
- Equivalent: ~`320` USD

**Bank Details:**
- **Selected Bank**: `STB` (Société Tunisienne de Banque)
- **RIB Number**: `10006000987654321098`
  - First 4 digits (1000) = STB bank code
  - Next 4 digits (6000) = Branch code
  - Last 12 digits = Account number

**Additional Details:**
- **Description**: `Business payment transfer`
- **Note**: `Payment for services rendered`

---

### 🏦 **Example 3: Transfer from Attijari Bank**

**Transfer Amount:**
- Amount: `250` TND
- Equivalent: ~`80` USD

**Bank Details:**
- **Selected Bank**: `Attijari Bank`
- **RIB Number**: `20037000555666777888`
  - First 4 digits (2003) = Attijari bank code
  - Format follows Tunisian banking standards

**Additional Details:**
- **Description**: `Personal savings transfer`
- **Note**: `Monthly budget allocation`

---

### 🏦 **Example 4: Transfer from UIB Bank**

**Transfer Amount:**
- Amount: `750` TND
- Equivalent: ~`240` USD

**Bank Details:**
- **Selected Bank**: `UIB` (Union Internationale de Banques)
- **RIB Number**: `20019000111222333444`

**Additional Details:**
- **Description**: `Investment fund transfer`
- **Note**: `Quarterly investment deposit`

---

## 📋 **Field-by-Field Guide**

### 1. **Amount Field**
- Enter amount in TND (Tunisian Dinars)
- Examples: `100`, `250`, `500`, `1000`, `1500`
- The app automatically converts to USD for backend processing

### 2. **Bank Selection Dropdown**
Available Tunisian banks in the app:
- ✅ `BIAT` - Banque Internationale Arabe de Tunisie
- ✅ `STB` - Société Tunisienne de Banque  
- ✅ `UIB` - Union Internationale de Banques
- ✅ `UBCI` - Union Bancaire pour le Commerce et l'Industrie
- ✅ `BNA` - Banque Nationale Agricole
- ✅ `Attijari Bank` - Attijari Bank Tunisia
- ✅ `Amen Bank`
- ✅ `BH Bank` - Banque de l'Habitat
- ✅ `ATB` - Arab Tunisian Bank
- ✅ `Zitouna Bank`
- ✅ `BFPME` - Banque de Financement des PME
- ✅ `ABC Bank` - Arab Banking Corporation

### 3. **RIB Number Field**
**Format**: 20-digit Tunisian RIB number
- **Pattern**: `XXXX XXXX XXXX XXXX XXXX`
- **Example**: `2004 1000 1234 5678 9012`

**Common Bank Codes** (First 4 digits):
- BIAT: `2004`
- STB: `1000` 
- UIB: `2001`
- UBCI: `2002`
- Attijari: `2003`
- BNA: `1700`
- Amen Bank: `2008`

### 4. **Description Field** (Optional)
Examples:
- `"Monthly salary deposit"`
- `"Business payment transfer"`
- `"Personal savings transfer"`
- `"Investment fund deposit"`
- `"Emergency fund transfer"`
- `"Family support payment"`

### 5. **Note Field** (Optional)
Examples:
- `"Transfer from my primary bank account"`
- `"Monthly budget allocation"`
- `"Payment for freelance work"`
- `"Savings account withdrawal"`
- `"Emergency expense coverage"`

---

## ✅ **Complete Example Form**

Here's what a completed form would look like:

```
💰 Transfer Amount: 500 TND (~160 USD)

🏦 Bank Details:
   Selected Bank: BIAT
   RIB Number: 20041000123456789012

📝 Additional Information:
   Description: Monthly salary deposit  
   Note: Transfer from my BIAT savings account
```

---

## ⚠️ **Important Notes**

1. **RIB Validation**: The app validates that you enter a proper 20-digit RIB number
2. **Bank Selection**: You must select a bank from the dropdown - free text is not allowed
3. **Amount Limits**: The form shows "100 TND - 3000 TND" as the transfer range
4. **Currency Conversion**: All amounts are converted to USD for backend processing
5. **Required Fields**: Amount, Bank, and RIB number are mandatory

## 🔄 **What Happens After Submission**

1. ✅ Form validates all required fields
2. ✅ Amount is converted from TND to USD  
3. ✅ Bank transfer record is created in the database
4. ✅ Transaction record is created for financial tracking
5. ✅ Your card balance is updated automatically
6. ✅ Unique reference numbers are generated for tracking
7. ✅ You're redirected to the dashboard to see updated balance

---

**💡 Tip**: Start with smaller amounts (100-250 TND) for testing, then use larger amounts once you're comfortable with the system!