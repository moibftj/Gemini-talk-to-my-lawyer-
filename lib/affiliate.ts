
const AFFILIATES_STORAGE_KEY = 'law-ai-affiliates';
const EMPLOYEES_STORAGE_KEY = 'law-ai-employees'; // Maps employee email to affiliate code

interface SignupRecord {
    userEmail: string;
    subscriptionAmount: number;
    usedDiscount: boolean;
    timestamp: string;
}

interface AffiliateData {
    signups: SignupRecord[];
}

// Helper to get/set data from localStorage
const getAffiliates = (): Record<string, AffiliateData> => {
    return JSON.parse(localStorage.getItem(AFFILIATES_STORAGE_KEY) || '{}');
};
const saveAffiliates = (data: Record<string, AffiliateData>) => {
    localStorage.setItem(AFFILIATES_STORAGE_KEY, JSON.stringify(data));
};
const getEmployees = (): Record<string, string> => {
    return JSON.parse(localStorage.getItem(EMPLOYEES_STORAGE_KEY) || '{}');
};
const saveEmployees = (data: Record<string, string>) => {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(data));
};

// Find employee email by their unique affiliate code
const findEmployeeByCode = (code: string): string | null => {
    const employees = getEmployees();
    return Object.keys(employees).find(email => employees[email].toLowerCase() === code.toLowerCase()) || null;
};

/**
 * Credits a referred sign-up to the appropriate employee.
 * @param affiliateCode The referral code used during sign-up.
 * @param signupDetails Details of the new user's sign-up.
 */
export const creditAffiliate = (
    affiliateCode: string,
    signupDetails: Omit<SignupRecord, 'timestamp'>
) => {
    const employeeEmail = findEmployeeByCode(affiliateCode);
    if (!employeeEmail) {
        console.warn(`Affiliate code ${affiliateCode} not found.`);
        return;
    }
    const affiliates = getAffiliates();
    if (!affiliates[employeeEmail]) {
        affiliates[employeeEmail] = { signups: [] };
    }
    affiliates[employeeEmail].signups.push({
        ...signupDetails,
        timestamp: new Date().toISOString()
    });
    saveAffiliates(affiliates);
    console.log(`Credited referral for ${signupDetails.userEmail} to ${employeeEmail}`);
};

/**
 * Retrieves and calculates performance data for a given employee.
 * @param employeeEmail The email of the employee.
 * @returns An object with the employee's code, total signups, earnings, and points.
 */
export const getAffiliateData = (employeeEmail: string) => {
    const employees = getEmployees();
    const affiliates = getAffiliates();
    const code = employees[employeeEmail] || 'N/A';
    const data = affiliates[employeeEmail];

    if (!data) {
        return { code, totalSignups: 0, totalEarnings: 0, totalPoints: 0 };
    }

    const totalSignups = data.signups.length;
    // 5% commission on subscription amount
    const totalEarnings = data.signups.reduce((sum, signup) => sum + signup.subscriptionAmount * 0.05, 0);
    // 1 point per referred user
    const totalPoints = data.signups.length;

    return { code, totalSignups, totalEarnings, totalPoints };
};

/**
 * Sets up a mock employee and affiliate data if it doesn't already exist.
 * This is used for demonstration purposes.
 */
export const initializeMockAffiliates = () => {
    const employees = getEmployees();
    const employeeEmail = 'employee@example.com';
    
    if (!employees[employeeEmail]) {
        employees[employeeEmail] = 'EMP123XYZ';
        saveEmployees(employees);

        const affiliates = getAffiliates();
        if (!affiliates[employeeEmail]) {
            affiliates[employeeEmail] = {
                signups: [
                    { userEmail: 'referred1@example.com', subscriptionAmount: 50, usedDiscount: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
                    { userEmail: 'referred2@example.com', subscriptionAmount: 50, usedDiscount: false, timestamp: new Date().toISOString() },
                ]
            };
            saveAffiliates(affiliates);
        }
    }
};
