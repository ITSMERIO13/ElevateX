import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.model.js';
import connectDB from '../mongoDBconnect.js';

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const newAdmin = new Admin({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await newAdmin.save();
    console.log('Admin user created successfully with credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123 (hashed in database)');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin(); 