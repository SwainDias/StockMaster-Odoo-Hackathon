# 📦 StockMaster – Inventory Management System (IMS)

A modular, real-time Inventory Management System built for the **Odoo Hackathon**.  
StockMaster digitizes and streamlines all stock operations, replacing manual registers and spreadsheets with a centralized, easy-to-use system.

---

## 🚀 Features

### 🔐 Authentication
- User Login / Signup  
- OTP-based password reset  
- Role-based access (Inventory Manager / Warehouse Staff)

---

## 🏠 Dashboard
The dashboard provides a quick summary of warehouse operations:

- Total Products in Stock  
- Low / Out-of-Stock Items  
- Pending Receipts  
- Pending Deliveries  
- Internal Transfers Scheduled  

### 🔍 Dynamic Filters
Filter operations by:
- Document Type (Receipt / Delivery / Transfer / Adjustment)  
- Status (Draft, Waiting, Ready, Done, Cancelled)  
- Warehouse or Location  
- Product Category  

---

## 🧾 Modules Overview

### 🛒 1. Product Management
- Create & update products  
- Assign categories, SKU, and UOM  
- Optional initial stock  
- Stock availability per location (On-hand, Reserved, Available)  

---

### 🚚 2. Receipts (Incoming Goods)
Used when goods arrive from vendors.

**Flow:**
1. Create Receipt  
2. Add Vendor & Products  
3. Enter Received Quantity  
4. Validate → Stock Increases  

Example:  
Receiving 50 units of *Steel Rods* increases stock by **+50**.

---

### 📤 3. Delivery Orders (Outgoing Goods)
Used when products are shipped to customers.

**Flow:**
1. Pick Items  
2. Pack Items  
3. Validate → Stock Decreases  

Example:  
Customer order of 10 chairs reduces stock by **–10**.

---

### 🔁 4. Internal Transfers
Move goods between locations such as:
- Warehouse → Production Floor  
- Rack A → Rack B  
- Warehouse 1 → Warehouse 2  

Stock quantity stays the same; **only location changes**.

---

### 📉 5. Stock Adjustments
Used to correct mismatches between physical count and system count.

**Flow:**
1. Select Product & Location  
2. Enter Counted Quantity  
3. System updates stock and logs adjustment  

---

### 📜 6. Move History
A complete log of all stock movements.

**List View includes:**
- Reference  
- Date  
- Contact  
- From → To  
- Quantity  
- Status  

**Color Indicators:**
- 🟩 IN (Incoming)  
- 🟥 OUT (Outgoing)

**Kanban View:**
Group operations by status:
- Draft  
- Waiting  
- Ready  
- Done  
- Cancelled  

---

## ⚙️ Settings
Manage warehouses and storage locations:
- Add Warehouse  
- Add Locations / Racks  
- Edit or Delete  

---

## 👤 Profile Menu
- View Profile  
- Update User Details  
- Logout  

---

# 🧭 Overall System Flow

1. User logs in → arrives at Dashboard  
2. User receives goods → stock increases  
3. User transfers goods internally → location changes  
4. User delivers goods → stock decreases  
5. User performs stock adjustments → mismatches corrected  
6. User tracks everything in Move History  
7. User configures locations & warehouses in Settings  

---

# 🏗️ Tech Stack (Modify according to your project)
- **Frontend:** React / Tailwind / HTML / CSS / JS  
- **Backend:** Python / Odoo / FastAPI / Django  
- **Database:** PostgreSQL / MySQL  
- **Version Control:** Git + GitHub  

---

# 📘 Running the Project

```bash
# Clone the repo
git clone <repo-url>

# Navigate to project directory
cd StockMaster

# Install dependencies
<installation commands>

# Start the application
<run command>
```

## 🤝 Team Members
- Swain Dias
- David Daniels  
- Dwayne Fernandes
- Soham Ghorpade

---

## 🏁 Conclusion

StockMaster provides a modern and modular solution for real-time inventory tracking.
Built for speed, accuracy, and efficient warehouse operations.
