package com.d.hrwork.model;

import java.sql.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mysql.jdbc.Blob;

@Entity
@Table(name = "user", schema = "hrwork")
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String firstName;

	private String lastName;

	private Date dateOfBirth;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private Contact contact;

	@ElementCollection(fetch = FetchType.EAGER)
	@JsonProperty("skills")
	private Set<String> skills;

	private byte[] resume;

	private UserStatus status;

	@ElementCollection(fetch = FetchType.EAGER)
	@JsonProperty("role")
	private Set<Roles> role;

	@OneToOne(fetch = FetchType.EAGER)
	@JsonBackReference
	private User manager;

	private String userName;

	private String password;

	@Transient
	private String oldpassword;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}

	public Set<String> getSkills() {
		return skills;
	}

	public void setSkills(Set<String> skills) {
		this.skills = skills;
	}

	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public UserStatus getStatus() {
		return status;
	}

	public void setStatus(UserStatus status) {
		this.status = status;
	}

	public String getOldpassword() {
		return oldpassword;
	}

	public void setOldpassword(String oldpassword) {
		this.oldpassword = oldpassword;
	}

	public Set<Roles> getRole() {
		return role;
	}

	public void setRole(Set<Roles> role) {
		this.role = role;
	}

	public byte[] getResume() {
		return resume;
	}

	public void setResume(byte[] resume) {
		this.resume = resume;
	}

 

	/*
	 * @Override public String toString() { return "User [id=" + id +
	 * ", firstName=" + firstName + ", lastName=" + lastName + ", dateOfBirth="
	 * + dateOfBirth + ", contact=" + contact + ", skills=" + skills +
	 * ", resume=" + resume + ", status=" + status + ", role=" + role +
	 * ", manager=" + manager + ", userName=" + userName + ", password=" +
	 * password + ", oldpassword=" + oldpassword + ", resumefile=" + resumefile
	 * + "]"; }
	 */

}
