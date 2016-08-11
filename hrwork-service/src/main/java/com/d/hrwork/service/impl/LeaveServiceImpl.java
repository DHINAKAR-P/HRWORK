package com.d.hrwork.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.d.hrwork.dao.LeaveDao;
import com.d.hrwork.model.Leave;
import com.d.hrwork.model.User;
import com.d.hrwork.service.LeaveService;

@Service
@Transactional
public class LeaveServiceImpl implements LeaveService {
	@Autowired
	LeaveDao leaveDao;
	Logger LOG = LoggerFactory.getLogger(LeaveServiceImpl.class);

	public Leave applyLeave(Leave leave) {

		LOG.debug("SERVICEimpl hitted for apply leave ");
		LOG.debug("id to fetch value from DB " + leave.getLeaveFor().getId());

		/*User leaveforid = leaveDao.findById(leave.getLeaveFor().getId());
		Long ed = leaveforid.getId();
		String name = leaveforid.getFirstName();
		System.out.println(ed);
		System.out.println(name);
		leave.setLeaveFor(leaveforid);
		System.out.println(leave.getLeaveFor().getId());
		
		User createduserbyid =leaveDao.findById(leave.getCreatedBy().getId());
		Long createId=createduserbyid.getId();
		System.out.println("createdBy id"+createId);
		leave.setCreatedBy(createduserbyid);
		System.out.println(leave.getCreatedBy().getId());
		
		
		User approveduserByid=leaveDao.findById(leave.getApprovedBy().getId());
		Long approvedId=approveduserByid.getId();
		System.out.println("ApprovedBy Id before setting"+approvedId);
		leave.setApprovedBy(approveduserByid); 
		System.out.println("approvedBy id Set value"+leave.getApprovedBy().getId());*/
		
		
		return leaveDao.applyLeave(leave);
	}

	/*
	 * public List<Leave> listOfleave() {
	 * 
	 * return leaveDao.listOfLeave(); }
	 */

	public Leave findLeavebyId(Long id) {

		return leaveDao.findLeaveById(id);
	}

	public int deleteLeave(Long id) {

		return leaveDao.deleteLeave(id);
	}

	public int cancelLeave(Leave leave) {
		
		System.out.printf("cancel leave in service impl layer ----",leave.getStatus());

		return leaveDao.cancelLeave(leave);
	}

	public int approveLeave(Leave leave) {

		return leaveDao.approveLeave(leave);
	}

	public List<Leave> noOfLeaves(Long id) {

		return leaveDao.noOfLeaves(id);
	}

	public Leave updateLeave(Leave leave) {
		


		return leaveDao.updateLeave(leave);
	}

	public List<Leave> listOfleave() {

		List<Leave> j = leaveDao.listOfLeave();
		for (int i = 0; i <= j.size(); i++) {
			System.out.println(j);
		}

		return j;
	}

	public List<Leave> leavelistByMonth(Leave user) {

		List<Leave> j = leaveDao.leavelistByMonth(user);

		for (int i = 0; i <= j.size(); i++) {
			System.out.println(j);
		}
		return j;
	}

}
