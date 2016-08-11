package com.d.hrwork.dao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.d.hrwork.model.Leave;
import com.d.hrwork.model.User;
import com.d.hrwork.repository.LeaveRepository;

@Repository
public class LeaveDao {
	@Autowired
	LeaveRepository leaverep;

	/*
	 * @Autowired UserRepository userRepository;
	 */

	public Leave applyLeave(Leave leave) {	
		
		
		
		User leaveforid = leaverep.findById(leave.getLeaveFor().getId());
		
		String name = leaveforid.getFirstName();
//		leaveforid.getRole();
//		leave.getLeaveFor().setRole(leaveforid.getRole());
		leave.setLeaveFor(leaveforid); 
		System.out.println("user to apply leave  "+name);
//		leave.setLeaveFor(leaveforid);
		System.out.println(leave.getLeaveFor().getId());
		
		/*User createduserbyid =leaverep.findById(leave.getCreatedBy().getId());
		Long createId=createduserbyid.getId();
		System.out.println("createdBy id"+createId);
		leave.setCreatedBy(createduserbyid);
		System.out.println(leave.getCreatedBy().getId());
		
		
		User approveduserByid=leaverep.findById(leave.getApprovedBy().getId());
		Long approvedId=approveduserByid.getId();
		System.out.println("ApprovedBy Id before setting"+approvedId);
		leave.setApprovedBy(approveduserByid); 
		System.out.println("approvedBy id Set value"+leave.getApprovedBy().getId());*/
		
		return this.leaverep.save(leave);
	}

	public User findById(Long id) {
		return leaverep.findById(id);

	}

	public List<Leave> listOfLeave() {
		return leaverep.findAll();
	}

	public Leave findLeaveById(Long id) {
		return leaverep.findLeaveById(id);
	}

	public int deleteLeave(Long id) {
		return leaverep.deleteById(id);
	}

	public int cancelLeave(Leave leave) {
		System.out.printf("   cancel DAO CLASS---",leave.getStatus());
		
		return leaverep.cancelLeave(leave.getStatus(), leave.getId());
	}

	public int approveLeave(Leave leave) {
		System.out.printf(" approve DAO CLASS---",leave.getStatus()); 
		
		return leaverep.approveLeave(leave.getStatus(), leave.getId());
	}

	public List<Leave> noOfLeaves(Long id) {
		System.out.println("id in dao layer"+id); 		
		return leaverep.noOfLeaves(id);
	}

	public Leave updateLeave(Leave leave) {

		return leaverep.saveAndFlush(leave);
	}

	public List<Leave> leavelistByMonth(Leave user) {
		
		
		return leaverep.leavelistByMonth(user.getTempdate(),user.getTempdate1());
	}

}
