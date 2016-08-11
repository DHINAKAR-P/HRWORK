package com.d.hrwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.d.hrwork.model.Contact;


public interface UserContactRepository extends JpaRepository<Contact, Long> {
	/*
	 * @Modifying
	 * 
	 * @Transactional
	 * 
	 * @Query(
	 * "UPDATE c SET address=:c.address,phone=:c.phone,photoUrl=:photoUrl,emailAddress=:emailAddress Contact as c WHERE id=:id"
	 * ) Contact updateUserContact(Long id, String address, Set<String> phone,
	 * String photoUrl, Set<String> emailAddress);
	 */

}
