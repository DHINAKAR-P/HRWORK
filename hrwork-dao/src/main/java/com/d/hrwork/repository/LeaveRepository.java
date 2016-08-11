package com.d.hrwork.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.d.hrwork.model.Leave;
import com.d.hrwork.model.LeaveStatus;
import com.d.hrwork.model.User;

public interface LeaveRepository extends JpaRepository<Leave, String> {

	@Query("Select s FROM User s WHERE s.id=:id")
	public User findById(@Param("id") Long id);

	@Query("Select s FROM Leave s WHERE s.id=:id")
	public Leave findLeaveById(@Param("id") Long id);
/*
	@Modifying
	@Transactional
	@Query("Update Leave s SET s.status=:status WHERE s.id=:id")
	public int cancelLeave(@Param("status") int status, @Param("id") Long id);*/

	@Modifying
	@Transactional
	@Query("Update Leave s SET s.status=:status WHERE s.id=:id")
	public int approveLeave(@Param("status") LeaveStatus status, @Param("id") Long id);

	@Modifying
	@Transactional
	public int deleteById(Long id);

	@Query("Select s FROM Leave s WHERE s.leaveFor.id=:leaveFor")
	public List<Leave> noOfLeaves(@Param("leaveFor") Long leaveFor);
	
	@Modifying
	@Transactional
	@Query("Update Leave l SET l.status=:status WHERE l.id=:id")
	public int cancelLeave(@Param("status")LeaveStatus status,@Param("id") Long id); 
	
	
	//@Query("SELECT s FROM Leave s WHERE s.leaveFromDate LIKE: tempdate OR s.leaveToDate LIKE tempdate")
	@Query("SELECT s FROM Leave s WHERE (leaveFromDate BETWEEN :tempdate AND :tempdate1) OR (leaveToDate BETWEEN :tempdate AND :tempdate1)")
	public List<Leave> leavelistByMonth(@Param("tempdate") Date tempdate,@Param("tempdate1")Date tempdate1);
	
}
