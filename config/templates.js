const templates = [
    {
        name: 'ecommerce',
        displayName: 'E-commerce',
        description: 'Product catalog with prices, categories, and stock',
        fields: [
            { name: 'product_id', type: 'uuid' },
            { name: 'product_name', type: 'name' },
            { name: 'price', type: 'price' },
            { name: 'category', type: 'text' },
            { name: 'stock', type: 'number' }
        ]
    },
    {
        name: 'banking',
        displayName: 'Banking',
        description: 'Bank accounts with balances and customer data',
        fields: [
            { name: 'account_id', type: 'uuid' },
            { name: 'customer_name', type: 'name' },
            { name: 'balance', type: 'price' },
            { name: 'account_type', type: 'text' },
            { name: 'created_date', type: 'date' }
        ]
    },
    {
        name: 'healthcare',
        displayName: 'Healthcare',
        description: 'Patient records with diagnoses and admissions',
        fields: [
            { name: 'patient_id', type: 'uuid' },
            { name: 'patient_name', type: 'name' },
            { name: 'diagnosis', type: 'text' },
            { name: 'admission_date', type: 'date' },
            { name: 'doctor_name', type: 'name' }
        ]
    },
    {
        name: 'education',
        displayName: 'Education',
        description: 'Student records with courses and grades',
        fields: [
            { name: 'student_id', type: 'uuid' },
            { name: 'student_name', type: 'name' },
            { name: 'course', type: 'text' },
            { name: 'grade', type: 'number' },
            { name: 'enrollment_date', type: 'date' }
        ]
    },
    {
        name: 'employees',
        displayName: 'Employees',
        description: 'Employee records with departments and salaries',
        fields: [
            { name: 'employee_id', type: 'uuid' },
            { name: 'full_name', type: 'name' },
            { name: 'email', type: 'email' },
            { name: 'department', type: 'text' },
            { name: 'salary', type: 'price' }
        ]
    },
    {
        name: 'crm',
        displayName: 'CRM',
        description: 'Customer relationship management data',
        fields: [
            { name: 'contact_id', type: 'uuid' },
            { name: 'contact_name', type: 'name' },
            { name: 'email', type: 'email' },
            { name: 'company', type: 'company' },
            { name: 'status', type: 'text' }
        ]
    },
    {
        name: 'realestate',
        displayName: 'Real Estate',
        description: 'Property listings with prices and features',
        fields: [
            { name: 'property_id', type: 'uuid' },
            { name: 'address', type: 'address' },
            { name: 'price', type: 'price' },
            { name: 'bedrooms', type: 'number' },
            { name: 'bathrooms', type: 'number' }
        ]
    },
    {
        name: 'restaurants',
        displayName: 'Restaurants',
        description: 'Restaurant listings with ratings and cuisine',
        fields: [
            { name: 'restaurant_id', type: 'uuid' },
            { name: 'name', type: 'name' },
            { name: 'cuisine', type: 'text' },
            { name: 'rating', type: 'number' },
            { name: 'address', type: 'address' }
        ]
    },
    {
        name: 'socialmedia',
        displayName: 'Social Media',
        description: 'Social media posts with engagement metrics',
        fields: [
            { name: 'post_id', type: 'uuid' },
            { name: 'user_name', type: 'name' },
            { name: 'content', type: 'text' },
            { name: 'likes', type: 'number' },
            { name: 'created_at', type: 'date' }
        ]
    },
    {
        name: 'logistics',
        displayName: 'Logistics',
        description: 'Orders with delivery tracking',
        fields: [
            { name: 'order_id', type: 'uuid' },
            { name: 'customer_name', type: 'name' },
            { name: 'product', type: 'text' },
            { name: 'quantity', type: 'number' },
            { name: 'delivery_date', type: 'date' }
        ]
    }
];

module.exports = templates;