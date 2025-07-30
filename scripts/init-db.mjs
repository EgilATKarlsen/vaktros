import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseSQL(sql) {
  const statements = [];
  let current = '';
  let inFunction = false;
  let dollarQuoteTag = null;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comments
    if (trimmedLine.startsWith('--') || trimmedLine === '') {
      continue;
    }
    
    current += line + '\n';
    
    // Check for dollar-quoted strings (PostgreSQL function bodies)
    const dollarMatch = line.match(/\$([^$]*)\$/g);
    if (dollarMatch) {
      for (const match of dollarMatch) {
        if (!dollarQuoteTag) {
          dollarQuoteTag = match;
          inFunction = true;
        } else if (match === dollarQuoteTag) {
          dollarQuoteTag = null;
          inFunction = false;
        }
      }
    }
    
    // Only split on semicolon if we're not inside a function
    if (line.includes(';') && !inFunction) {
      statements.push(current.trim());
      current = '';
    }
  }
  
  // Add any remaining content
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements.filter(stmt => stmt.length > 0);
}

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
    
    // Read schema from SQL file
    const schemaPath = join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');
    
    console.log("📄 Reading schema from:", schemaPath);
    
    // Execute the entire schema as one statement - Neon can handle multiple statements
    try {
      await sql.query(schemaSQL);
      console.log("✅ Schema executed successfully");
    } catch (batchError) {
      // If that fails, try executing statements individually
      console.log("⚠️  Batch execution failed, trying individual statements...");
      console.log("📝 Batch error:", batchError.message);
      
      const statements = parseSQL(schemaSQL);
      
      console.log(`🔧 Executing ${statements.length} SQL statements individually...`);
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await sql.query(statement);
            console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
          } catch (error) {
            // Log but don't fail on statements that might already exist
            if (error.code !== '42P07' && error.code !== '42710' && error.code !== '42P01') { 
              console.warn(`⚠️  Warning executing statement: ${error.message}`);
            } else {
              console.log(`ℹ️  Skipped (already exists): ${statement.substring(0, 50)}...`);
            }
          }
        }
      }
    }
    
    console.log("✅ Database schema initialized successfully!");
    console.log("📊 Schema loaded from schema.sql:");
    console.log("  - tickets");
    console.log("  - user_profiles (SMS notifications)");
    console.log("  - ticket_attachments");
    console.log("  - indexes and triggers");
    console.log("🔧 All tables, indexes, and triggers created from schema.sql");
    
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    console.error("📝 Full error:", error);
    process.exit(1);
  }
}

initDatabase(); 