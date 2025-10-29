import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/pages/Dashboard";
import { SalesDashboard } from "@/pages/SalesDashboard";
import { SalesCart } from "@/pages/SalesCart";
import { SalesOrders } from "@/pages/SalesOrders";
import { TestSalesOrders } from "@/pages/TestSalesOrders";
import { ProductManagement } from "@/pages/ProductManagement";
import { CustomerManagement } from "@/pages/CustomerManagement";
import { TransactionHistory } from "@/pages/TransactionHistory";
import { SalesAnalytics } from "@/pages/SalesAnalytics";
import { SpendingAnalytics } from "@/pages/SpendingAnalytics";
import { EmployeeManagement } from "@/pages/EmployeeManagement";
import { SupplierManagement } from "@/pages/SupplierManagement";
import { PurchaseOrders } from "@/pages/PurchaseOrders";
import { PurchaseDashboard } from "@/pages/PurchaseDashboard";
import { PurchaseTerminal } from "@/pages/PurchaseTerminal";
import { PurchaseTransactionHistory } from "@/pages/PurchaseTransactionHistory";
import { PurchaseReports } from "@/pages/PurchaseReports";
import { ExpenseManagement } from "@/pages/ExpenseManagement";
import { ReturnsManagement } from "@/pages/ReturnsManagement";
import { DebtManagement } from "@/pages/DebtManagement";
import { CustomerSettlements } from "@/pages/CustomerSettlements";
import { SupplierSettlements } from "@/pages/SupplierSettlements";
import { DiscountManagement } from "@/pages/DiscountManagement";
import { InventoryAudit } from "@/pages/InventoryAudit";
import { AccessLogs } from "@/pages/AccessLogs";
import { ComprehensiveDashboard } from "@/pages/ComprehensiveDashboard";
import { FinanceDashboard } from "@/pages/FinanceDashboard";
import { FinancialReports } from "@/pages/FinancialReports";
import { IncomeStatement } from "@/pages/IncomeStatement";
import { Settings } from "@/pages/Settings";
import { AutomatedDashboard } from "@/pages/AutomatedDashboard";
import { SplashScreen } from "@/components/SplashScreen";
import { TestDataDisplay } from "@/testDataDisplay";
import { useAuth } from "@/contexts/AuthContext";

type ViewState = "login" | "dashboard" | "sales" | "sales-cart" | "sales-orders" | "test-sales-orders" | "inventory" | "products" | "purchase" | "finance" | "customers" | "transactions" | "analytics" | "spending-analytics" | "employees" | "suppliers" | "purchase-orders" | "purchase-terminal" | "purchase-transactions" | "purchase-reports" | "expenses" | "returns" | "debts" | "customer-settlements" | "supplier-settlements" | "discounts" | "audit" | "access-logs" | "comprehensive" | "reports" | "financial-reports" | "income-statement" | "settings" | "automated" | "test-data";

const Index = () => {
  const { user, login } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(user ? "comprehensive" : "login");
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash screen after 6 seconds to match the enhanced animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      // Try Supabase authentication first
      const result = await login(credentials.username, credentials.password);
      
      if (result.error) {
        // If Supabase auth fails, use mock authentication
        console.warn("Supabase auth failed, using mock auth:", result.error);
        setCurrentView("comprehensive");
      } else {
        // Supabase auth successful
        console.log("Supabase auth successful:", result);
        setCurrentView("comprehensive");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setCurrentView("login");
  };

  const handleNavigate = (destination: string) => {
    switch (destination) {
      case "sales":
        setCurrentView("sales");
        break;
      case "cart":
        setCurrentView("sales-cart");
        break;
      case "orders":
        setCurrentView("sales-orders");
        break;
      case "test-sales-orders":
        setCurrentView("test-sales-orders");
        break;
      case "test-data":
        setCurrentView("test-data");
        break;
      case "inventory":
      case "products":
        setCurrentView("products");
        break;
      case "purchase":
        setCurrentView("purchase");
        break;
      case "finance":
        setCurrentView("finance");
        break;
      case "customers":
        setCurrentView("customers");
        break;
      case "transactions":
        console.log("Handling navigation to transactions - setting view to transactions");
        setCurrentView("transactions");
        break;
      case "analytics":
        setCurrentView("spending-analytics");
        break;
      case "employees":
        setCurrentView("employees");
        break;
      case "suppliers":
        setCurrentView("suppliers");
        break;
      case "purchase-orders":
        setCurrentView("purchase-orders");
        break;
      case "purchase-terminal":
        setCurrentView("purchase-terminal");
        break;
      case "purchase-transactions":
        setCurrentView("purchase-transactions");
        break;
      case "purchase-reports":
        setCurrentView("purchase-reports");
        break;
      case "expenses":
        setCurrentView("expenses");
        break;
      case "returns":
        setCurrentView("returns");
        break;
      case "debts":
        setCurrentView("debts");
        break;
      case "customer-settlements":
        setCurrentView("customer-settlements");
        break;
      case "supplier-settlements":
        setCurrentView("supplier-settlements");
        break;
      case "discounts":
        setCurrentView("discounts");
        break;
      case "audit":
        setCurrentView("audit");
        break;
      case "access-logs":
        setCurrentView("access-logs");
        break;
      case "comprehensive":
        setCurrentView("comprehensive");
        break;
      case "reports":
        // Show financial reports view
        setCurrentView("financial-reports");
        break;
      case "income-statement":
        // Show income statement view
        setCurrentView("income-statement");
        break;
      case "settings":
        setCurrentView("settings");
        break;
      case "scanner":
        setCurrentView("sales-cart");
        break;
      case "automated":
        setCurrentView("automated");
        break;
      default:
        console.log("Unknown destination:", destination);
        console.log("Current view set to comprehensive as fallback");
        setCurrentView("comprehensive");
        break;
    }
  };

  const handleBack = () => {
    switch (currentView) {
      case "sales":
        setCurrentView("comprehensive");
        break;
      case "sales-cart":
        setCurrentView("sales");
        break;
      case "sales-orders":
        setCurrentView("sales");
        break;
      case "test-sales-orders":
        setCurrentView("comprehensive");
        break;
      case "products":
        setCurrentView("comprehensive");
        break;
      case "customers":
        setCurrentView("sales");
        break;
      case "transactions":
        setCurrentView("sales");
        break;
      case "analytics":
      case "spending-analytics":
        setCurrentView("purchase");
        break;
      case "employees":
        setCurrentView("comprehensive");
        break;
      case "suppliers":
        setCurrentView("purchase");
        break;
      case "purchase-orders":
        setCurrentView("purchase");
        break;
      case "purchase-terminal":
        setCurrentView("purchase");
        break;
      case "purchase-transactions":
        setCurrentView("purchase");
        break;
      case "purchase-reports":
        setCurrentView("purchase");
        break;
      case "purchase":
        setCurrentView("comprehensive");
        break;
      case "expenses":
        setCurrentView("finance");
        break;
      case "returns":
        setCurrentView("comprehensive");
        break;
      case "debts":
        setCurrentView("finance");
        break;
      case "customer-settlements":
        setCurrentView("finance");
        break;
      case "supplier-settlements":
        setCurrentView("finance");
        break;
      case "discounts":
        setCurrentView("sales");
        break;
      case "audit":
        setCurrentView("comprehensive");
        break;
      case "access-logs":
        setCurrentView("comprehensive");
        break;
      case "finance":
        setCurrentView("comprehensive");
        break;
      case "settings":
        setCurrentView("comprehensive");
        break;
      case "financial-reports":
        setCurrentView("finance");
        break;
      case "income-statement":
        setCurrentView("financial-reports");
        break;
      default:
        setCurrentView("comprehensive");
    }
  };

  // Show splash screen first, then login form
  if (showSplash) {
    return <SplashScreen />;
  }

  if (currentView === "login" || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      {(() => {
        console.log("Rendering currentView:", currentView);
        switch (currentView) {
          case "comprehensive":
            console.log("Rendering ComprehensiveDashboard");
            return (
              <ComprehensiveDashboard
                username={user?.email || "admin"}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            );
          case "dashboard":
            console.log("Rendering Dashboard");
            return (
              <Dashboard
                username={user?.email || "admin"}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            );
          case "sales":
            console.log("Rendering SalesDashboard");
            return (
              <SalesDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "sales-cart":
            console.log("Rendering SalesCart");
            return (
              <SalesCart
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                autoOpenScanner={true}
              />
            );
          case "sales-orders":
            console.log("Rendering SalesOrders");
            return (
              <SalesOrders
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "test-sales-orders":
            console.log("Rendering TestSalesOrders");
            return (
              <TestSalesOrders
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "products":
            console.log("Rendering ProductManagement");
            return (
              <ProductManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "customers":
            console.log("Rendering CustomerManagement");
            return (
              <CustomerManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "transactions":
            console.log("Rendering TransactionHistory");
            return (
              <TransactionHistory
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "analytics":
          case "spending-analytics":
            console.log("Rendering SpendingAnalytics");
            return (
              <SpendingAnalytics
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "employees":
            console.log("Rendering EmployeeManagement");
            return (
              <EmployeeManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase":
            console.log("Rendering PurchaseDashboard");
            return (
              <PurchaseDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "purchase-terminal":
            console.log("Rendering PurchaseTerminal");
            return (
              <PurchaseTerminal
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase-transactions":
            console.log("Rendering PurchaseTransactionHistory");
            return (
              <PurchaseTransactionHistory
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase-reports":
            console.log("Rendering PurchaseReports");
            return (
              <PurchaseReports
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "suppliers":
            console.log("Rendering SupplierManagement");
            return (
              <SupplierManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase-orders":
            console.log("Rendering PurchaseOrders");
            return (
              <PurchaseOrders
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "finance":
            console.log("Rendering FinanceDashboard");
            return (
              <FinanceDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "expenses":
            console.log("Rendering ExpenseManagement");
            return (
              <ExpenseManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "returns":
            console.log("Rendering ReturnsManagement");
            return (
              <ReturnsManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "debts":
            console.log("Rendering DebtManagement");
            return (
              <DebtManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "customer-settlements":
            console.log("Rendering CustomerSettlements");
            return (
              <CustomerSettlements
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "supplier-settlements":
            console.log("Rendering SupplierSettlements");
            return (
              <SupplierSettlements
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "discounts":
            console.log("Rendering DiscountManagement");
            return (
              <DiscountManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "audit":
            console.log("Rendering InventoryAudit");
            return (
              <InventoryAudit
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "access-logs":
            console.log("Rendering AccessLogs");
            return (
              <AccessLogs
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "financial-reports":
            console.log("Rendering FinancialReports");
            return (
              <FinancialReports
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "income-statement":
            console.log("Rendering IncomeStatement");
            return (
              <IncomeStatement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "settings":
            console.log("Rendering Settings");
            return (
              <Settings
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "automated":
            console.log("Rendering AutomatedDashboard");
            return (
              <AutomatedDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "test-data":
            console.log("Rendering TestDataDisplay");
            return (
              <TestDataDisplay />
            );
          default:
            console.log("Rendering default fallback for:", currentView);
            return (
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center p-6 max-w-md">
                  <h1 className="text-2xl font-bold mb-4">
                    {String(currentView).charAt(0).toUpperCase() + String(currentView).slice(1)} Dashboard
                  </h1>
                  <p className="text-muted-foreground mb-4">This module is coming soon!</p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBack();
                    }}
                    className="text-primary hover:underline px-4 py-2 border border-primary rounded-md"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default Index;