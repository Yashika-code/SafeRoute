import express from "express"

export const createReport = async (req, res) => {
    try {
        const report = await Report.create({
            ...req.body,
            userId: req.user?.id || null
        });
        res.status(201).json(report, { message: "Report created successfully" });
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
};

export const getReports = async (req, res) => {
    const reports = await Report.find({ status: "approved" })
        .sort({ createdAt: -1 });
    res.json(reports);
}

export const voteReports=async(req,res)=>{
    const {type} =req.body;
    const report =await Report.findById(req.params.id);
    if(!report) return res.status(404).json({message:"Report not found"});

    if(type==="upvote") report.upvotes+=1;
    if(type==="downvote") report.downvotes+=1;

    await report.save();
    res.json(report);
}

export const updateReportStatus=async(req,res)=>{
    const report=await Report.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status},
        { new:true }
    );
    res.json(report);
}