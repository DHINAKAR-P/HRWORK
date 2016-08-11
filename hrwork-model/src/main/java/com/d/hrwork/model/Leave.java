package com.d.hrwork.model;

import java.sql.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Leave", schema = "hrwork")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Leave {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private User leaveFor;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private User createdBy;

	private Date createOn;

	private LeaveStatus status;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private User approvedBy;

	private Date leaveFromDate;

	private Date leaveToDate;

	private float numberOfDays;

	private String Summary;

	@Transient
	private Date tempdate;

	@Transient
	private Date tempdate1;

	private LeaveType leaveType;

	public Date getTempdate() {
		return tempdate;
	}

	public void setTempdate(Date tempdate) {
		this.tempdate = tempdate;
	}

	public Date getTempdate1() {
		return tempdate1;
	}

	public void setTempdate1(Date tempdate1) {
		this.tempdate1 = tempdate1;
	}

	public LeaveStatus getStatus() {
		return status;
	}

	public void setStatus(LeaveStatus status) {
		this.status = status;
	}

	public User getLeaveFor() {
		return leaveFor;
	}

	public void setLeaveFor(User leaveFor) {
		this.leaveFor = leaveFor;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreateOn() {
		return createOn;
	}

	public void setCreateOn(Date createOn) {
		this.createOn = createOn;
	}

	public User getApprovedBy() {
		return approvedBy;
	}

	public void setApprovedBy(User approvedBy) {
		this.approvedBy = approvedBy;
	}

	public Date getLeaveFromDate() {
		return leaveFromDate;
	}

	public void setLeaveFromDate(Date leaveFromDate) {
		this.leaveFromDate = leaveFromDate;
	}

	public Date getLeaveToDate() {
		return leaveToDate;
	}

	public void setLeaveToDate(Date leaveToDate) {
		this.leaveToDate = leaveToDate;
	}

	public float getNumberOfDays() {
		return numberOfDays;
	}

	public void setNumberOfDays(float numberOfDays) {
		this.numberOfDays = numberOfDays;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSummary() {
		return Summary;
	}

	public void setSummary(String summary) {
		Summary = summary;
	}

	public LeaveType getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(LeaveType leaveType) {
		this.leaveType = leaveType;
	}

	@Override
	public String toString() {
		return "Leave [id=" + id + ", leaveFor=" + leaveFor + ", createdBy=" + createdBy + ", createOn=" + createOn + ", status=" + status + ", approvedBy=" + approvedBy
				+ ", leaveFromDate=" + leaveFromDate + ", leaveToDate=" + leaveToDate + ", numberOfDays=" + numberOfDays + ", Summary=" + Summary + ", tempdate=" + tempdate
				+ ", tempdate1=" + tempdate1 + ", leaveType=" + leaveType + "]";
	}

}
