package com.d.hrwork.service;

import java.util.List;

import com.d.hrwork.model.Leave;
import com.d.hrwork.model.User;
public interface LeaveService {

	public Leave applyLeave(Leave leave);

	public List<Leave> listOfleave();

	public Leave findLeavebyId(Long id);

	public int deleteLeave(Long id);

	public int cancelLeave(Leave leave);

	public int approveLeave(Leave leave);

	public List<Leave> noOfLeaves(Long id);

	public Leave updateLeave(Leave leave);

	public List<Leave> leavelistByMonth(Leave user);
}
