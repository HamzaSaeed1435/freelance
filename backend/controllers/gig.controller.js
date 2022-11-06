const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Freelancer = require("../models/freelancerModel");
const blog = require('../models/BlogModel');
const Client = require('../models/clientModel')
const Comments = require('../models/commentModel') 
const RComments = require('../models/RCommentsModel');
const { findOneAndUpdate } = require("../models/freelancerModel");
const { json } = require("express");
const mongoose = require("mongoose");
const gigs = require('../models/gigModel')
const Orders = require('../models/orderModel')
const { saveNotifcation } = require('../utils/Notification')
// add gig
const add_gig = async (req, res) => {

  try {
    const { title, Category, skills, BASIC, STANDARD, PREMIUM, description, requirements } = req.body;
    if (!title) { return res.status(401).send({ msg: "Title field is required" }) }

    if (!skills) { return res.status(401).send({ msg: "skills field is required" }) }

    if (!Category) { return res.status(401).send({ msg: "Category field is required" }) }

    if (!BASIC) { return res.status(401).send({ msg: "BASIC field is required" }) }

    if (!STANDARD) { return res.status(401).send({ msg: "BASIC field is required" }) }
    
    if (!PREMIUM) { return res.status(401).send({ msg: "BASIC field is required" }) }
    
    if (!description) { return res.status(401).send({ msg: "BASIC field is required" }) }
    
    if (!requirements) { return res.status(401).send({ msg: "BASIC field is required" }) }

    if(!BASIC.name || !BASIC.details || !BASIC.time || !BASIC.revisions || !BASIC.Price){
      return res.status(401).send({errorMessage: `All basic fields are required.`})
    }
    if(!STANDARD.name || !STANDARD.details || !STANDARD.time || !STANDARD.revisions || !STANDARD.Price){
      return res.status(401).send({errorMessage: `All STANDARD fields are required.`})
    }
    if(!PREMIUM.name || !PREMIUM.details || !PREMIUM.time || !PREMIUM.revisions || !PREMIUM.Price){
      return res.status(401).send({errorMessage: `All STANDARD fields are required.`})
    }

    if(skills.length > 3){
      return res.status(400).send({msg: `you cannot add more than three skills.`})
    };
    
    if (!req.file) { return res.status(401).send({ msg: "attachments field is required" }) }

    const attachments = req.file.path;
   
    // Check for freelancer
    if (!req.freelancer) { res.status(401).json({ errorMessage: "Unauthorized" }) } 
    else {
      const { id } = req.freelancer;
      const freelancerExists = await Freelancer.findById(id)
      if (!freelancerExists) { res.status(403).json({ errorMessage: "Unauthorized" }) }
      // save data in database
      const response = await gigs.create({
       freelancer: id,
        title,
        skills,
        attachments,
        Category,
        BASIC,
        STANDARD,
        PREMIUM,
        description,
        requirements
      });
      if(response){
        console.log(freelancerExists.total_gigs);
        let count = freelancerExists.total_gigs || 0
        count = count + 1
       await Freelancer.findByIdAndUpdate(id, {total_gigs: count})
      //  await notify.create({
      //   title:'Gig',
      //   context: 'gig created successfully',
      //   sendto: id,
      //   sendfrom: id
      //  })

        return res.status(200).json({response}) }
        else{ return res.status(400).send({errorMessage: `error inserting data in database`}) }
    }
  } catch (error) {
    console.log(error);
  }
}

// edit gig
const edit_gig = async (req, res) => {
  try {
    const { title, Category, skills, BASIC, STANDARD, PREMIUM, description, requirements } = req.body;
    const gigid = req.params.gig_id
    if (!mongoose.isValidObjectId(gigid)) {
      return res.status(401).send({errorMessage: `Enter valid id`})
    }
    
    if (!req.freelancer) { res.status(401).json({ errorMessage: "Client Cannot access this Route" }) } 
    
    const { id } = req.freelancer;
    const freelancerExists = await Freelancer.findById(id);
    if (!freelancerExists) { res.status(403).json({ errorMessage: "Unauthorized" }) }
    // if user didnot attach photo
    if (!req.file) {
      const response = await gigs.findByIdAndUpdate(gigid,{
        title,
        skills,
        Category,
        BASIC,
        STANDARD,
        PREMIUM,
        description,
        requirements
    });
      if(response){
        return res.status(200).json({response}) }
        else{ return res.status(400).send({errorMessage: `no gig found with ${gigid}`}) }
     }

    const attachments = req.file.path;
    if(req.file){
      // save data in database
      const response = await gigs.findByIdAndUpdate(gigid,{
        title,
        skills,
        attachments,
        Category,
        BASIC,
        STANDARD,
        PREMIUM,
        description,
        requirements
    });
      if(response){
        return res.status(200).json({response}) }
        else{ return res.status(400).send({errorMessage: `no gig found with ${gigid}`}) }
    }
  } 
  catch (error) {console.log(error)}
}

// delete gig
const delete_gig = async (req, res) => {
  try {
    const gigid = req.params.gig_id
    if (!mongoose.isValidObjectId(gigid)) {
      return res.status(401).send({errorMessage: `Enter valid id`})
 }
    // Check for freelancer
    if (!req.freelancer) { res.status(401).json({ errorMessage: "Client Cannot access this Route" }) } 
    else {
      const { id } = req.freelancer;
      // console.log(id);
      const freelancerExists = await Freelancer.findById(id);
      if (!freelancerExists) { res.status(403).json({ errorMessage: "Unauthorized" }) }
      // save data in database
      const response = await gigs.findById(gigid)
      
      if(response){
        await gigs.deleteOne({_id: gigid})
        let count = freelancerExists.total_gigs || 0
        count = count - 1
       await Freelancer.findByIdAndUpdate(id, {total_gigs: count})
        return res.status(200).json({msg: `Gig successfully deleted with given id: ${gigid}`}) }
      else{ return res.status(400).send({errorMessage: `no gig found with id: ${gigid}`}) }
    }
  } catch (error) { console.log(error) }
}

// show all gigs with freelancer
const get_gigs = async (req, res) => {
  try {
    // Check for freelancer
    if (!req.freelancer) { res.status(401).json({ errorMessage: "Client Cannot access this Route" }) } 
    else {
      const { id } = req.freelancer;
      // console.log(id);
      const freelancerExists = await Freelancer.findById(id);
      if (!freelancerExists) { res.status(403).json({ errorMessage: "Unauthorized" }) }
      // save data in database
      const response = await gigs.find().populate('freelancer')
      
      if(response){
        return res.status(200).send(response) }
      else{ return res.status(400).send({errorMessage: `no gig found with id: ${gigid}`}) }
    }
  } catch (error) { console.log(error) }
}

// when client creates order
const create_order = async (req, res) => {
  try {
    // Check for client
    if (!req.client) { res.status(401).json({ errorMessage: "freelancer Cannot access this Route" }) } 
    else {
      const gig_id = req.params.gig_id
      if (!mongoose.isValidObjectId(gig_id)) {
        return res.status(401).send({errorMessage: `Enter valid gig id`})
   }
   const chechgig = await gigs.findById(gig_id)
  //  console.log(chechgig.freelancer)
   if(!chechgig){ return res.status(401).send({errorMessage: ` no gig found with id: ${gig_id}`})}
      const { id } = req.client;
      const clientExists = await Client.findById(id);
      if (!clientExists) { return res.status(403).json({ errorMessage: "Unauthorized" }) }
      const pack = req.body.package.toUpperCase()
      if(!pack){ return res.status(400).send({errorMessage: `pack field is required`}) }
      
      if(pack == 'BASIC'){
      // saving order record
      const order = Orders.create({
        type: 'gig',
        client: id,
        proposalId: gig_id,
        freelancer: chechgig.freelancer,
        price: chechgig.BASIC.Price   
      })
      await saveNotifcation(id , chechgig.freelancer , gig_id , 'Order Created on Your gig' ,  chechgig.title)
      return res.status(200).send({msg: `success`})
    }
    if( pack == 'STANDARD'){
      const order = Orders.create({
        type: 'gig',
        client: id,
        proposalId: gig_id,
        freelancer: chechgig.freelancer,
        price: chechgig.STANDARD.Price   
      })
      await saveNotifcation(id , chechgig.freelancer , gig_id , 'Order Created on Your gig' ,  chechgig.title)
      return res.status(200).send({msg: `success`})
    }
    if(pack == 'PREMIUM'){
      const order = Orders.create({
        type: 'gig',
        client: id,
        proposalId: gig_id,
        freelancer: chechgig.freelancer,
        price: chechgig.PREMIUM.Price   
      })
      await saveNotifcation(id , chechgig.freelancer , gig_id , 'Order Created on Your gig' ,  chechgig.title)
      return res.status(200).send({msg: `success`})
    }
    else{ return res.status(400).send({ msg:` Please select package only basic, standard or premium` })}

  }

  } catch (error) { console.log(error) }
}
 


module.exports={
  add_gig,
  edit_gig,
  delete_gig,
  get_gigs,
  create_order
}