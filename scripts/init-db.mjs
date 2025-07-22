import { neon } from "@neondatabase/serverless";

async function initDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is required');
      console.log('📋 Make sure you have DATABASE_URL set in your .env file');
      console.log('💡 Run: pnpm run db:init');
      process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);
    
    console.log("🔄 Initializing database schema...");
    
    // Execute each SQL statement individually using tagged template literals
    
    // Create tickets table
    await sql`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
        category VARCHAR(50) NOT NULL CHECK (category IN ('Technical', 'Billing', 'Feature Request', 'Bug Report', 'General Support')),
        status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
        team_id VARCHAR(255) NOT NULL,
        creator_id VARCHAR(255) NOT NULL,
        creator_name VARCHAR(255) NOT NULL,
        creator_email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create ticket_attachments table
    await sql`
      CREATE TABLE IF NOT EXISTS ticket_attachments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_tickets_team_id ON tickets(team_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tickets_creator_id ON tickets(creator_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tickets_severity ON tickets(severity)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id)`;
    
    // Create update trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    
    // Create trigger
    await sql`
      DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets
    `;
    
    await sql`
      CREATE TRIGGER update_tickets_updated_at 
      BEFORE UPDATE ON tickets
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;
    
    console.log("✅ Database schema initialized successfully!");
    console.log("📊 Created tables:");
    console.log("  - tickets");
    console.log("  - ticket_attachments");
    console.log("🔧 Created indexes and triggers for optimal performance");
    
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    console.error("📝 Full error:", error);
    process.exit(1);
  }
}

initDatabase(); 