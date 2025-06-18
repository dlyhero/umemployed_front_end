// Environment variable validation for production builds
const validateEnvVars = () => {
  const requiredEnvVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️  Production build will fail without these variables');
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are present');
  }
};

// Only run validation in production builds
if (process.env.NODE_ENV === 'production') {
  validateEnvVars();
}

module.exports = { validateEnvVars };
