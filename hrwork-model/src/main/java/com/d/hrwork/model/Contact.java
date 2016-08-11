package com.d.hrwork.model;

import java.util.Set;

//import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
///import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "Contact", schema = "hrwork")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Contact {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String address;

	private String photoUrl;

	@ElementCollection(fetch = FetchType.EAGER)
	@JsonProperty("phone")
	private Set<String> phone;

	@ElementCollection(fetch = FetchType.EAGER)
	@JsonProperty("emailAddress")
	private Set<String> emailAddress;

	/*
	 * @OneToOne(cascade = CascadeType.ALL) private User user;
	 */

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhotoUrl() {
		return photoUrl;
	}

	public void setPhotoUrl(String photoUrl) {
		this.photoUrl = photoUrl;
	}

	public Set<String> getPhone() {
		return phone;
	}

	public void setPhone(Set<String> phone) {
		this.phone = phone;
	}

	public Set<String> getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(Set<String> emailAddress) {
		this.emailAddress = emailAddress;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "Contact [id=" + id + ", address=" + address + ", photoUrl="
				+ photoUrl + ", phone=" + phone + ", emailAddress="
				+ emailAddress + "]";
	}

}
