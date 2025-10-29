import { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle, AlertCircle, Database, Wifi, Lock, Settings, User } from "lucide-react";
import "../App.css";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState([
    { id: 1, text: "Initializing system", icon: Settings, completed: false, error: false },
    { id: 2, text: "Loading assets", icon: User, completed: false, error: false },
    { id: 3, text: "Connecting to database", icon: Database, completed: false, error: false },
    { id: 4, text: "Verifying permissions", icon: Lock, completed: false, error: false },
    { id: 5, text: "Checking network", icon: Wifi, completed: false, error: false },
    { id: 6, text: "Preparing dashboard", icon: ShoppingCart, completed: false, error: false },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Hide splash screen after 6 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    // Simulate loading progress with realistic delays
    const progressTimers = [];
    let delay = 300;
    
    loadingSteps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(prev => {
          if (prev < loadingSteps.length) {
            const updatedSteps = [...loadingSteps];
            // Simulate occasional delays or issues
            if (index === 2 && Math.random() > 0.8) { // 20% chance of database delay
              updatedSteps[prev].error = true;
              setIsError(true);
              setErrorMessage("Database connection delayed. Retrying...");
              setTimeout(() => {
                updatedSteps[prev].error = false;
                updatedSteps[prev].completed = true;
                setLoadingSteps(updatedSteps);
                setIsError(false);
                setErrorMessage("");
              }, 1000);
            } else {
              updatedSteps[prev].completed = true;
              setLoadingSteps(updatedSteps);
            }
            return prev + 1;
          }
          return prev;
        });
      }, delay);
      
      progressTimers.push(timer);
      delay += Math.random() > 0.7 ? 900 : 500; // Randomize delays for realism
    });

    return () => {
      clearTimeout(hideTimer);
      progressTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-primary/20 flex items-center justify-center splash-screen z-50">
      <div className="text-center max-w-md w-full px-4">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-primary rounded-full p-6 shadow-lg mx-auto w-24 h-24 flex items-center justify-center">
            {isError ? (
              <AlertCircle className="h-12 w-12 text-white animate-fade" />
            ) : (
              <ShoppingCart className="h-12 w-12 text-white" />
            )}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground splash-fade-in">
          The Manha Super Central Backery  🫱🏽‍🫲🏻
        </h1>

        <div className="w-32 h-1 bg-primary mx-auto mb-6 splash-fade-in"></div>

        <p className="text-base md:text-lg mb-8 text-muted-foreground splash-fade-in">
          Biashara kidigitaly 💫
        </p>

        {/* Loading progress indicator */}
        <div className="mb-8 splash-fade-in">
          <div className="bg-secondary rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStep / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="space-y-3">
            {loadingSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`flex items-center text-sm transition-all duration-300 ${
                    step.completed ? 'text-primary' : 
                    step.error ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}
                >
                  <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : step.error ? (
                      <AlertCircle className="h-4 w-4 animate-fade" />
                    ) : currentStep === index ? (
                      <div className="h-3 w-3 border-2 border-primary rounded-full animate-pulse"></div>
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </div>
                  <span>{step.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {isError ? (
          <div className="bg-destructive/20 border border-destructive rounded-lg p-3 mb-6 splash-fade-in">
            <p className="text-destructive text-sm">{errorMessage || "System issue detected. Retrying..."}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-center space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-6">
          Version 2.1.0
        </p>
      </div>
    </div>
  );
};