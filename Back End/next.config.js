module.exports = {
  reactStrictMode: true,
  env:{
    FRONTEND: "https://rentuxsample.netlify.app", // "http://localhost:3100"
    PASSWORD:'passwordispassword@147',
    MASTERPASSWORD:'!#masterpasswordismasterpassword@19.71',
    JWTKEY:'!#yoursecretissafewithme@19.71',
    DATA_DIR:'./backup-data/DATA',
    GIT_DIR:'./backup-data',
    git:{
      EMAIL :'rentux-sample@protonmail.com',
      USER : 'Rentux-Sample',
      PASS : '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',
      REPO : 'github.com/Rentux-Sample/backup-data'
    }
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: this.env.FRONTEND },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}
