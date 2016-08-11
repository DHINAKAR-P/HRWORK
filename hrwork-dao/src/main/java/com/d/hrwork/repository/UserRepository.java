package com.d.hrwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//import com.d.hrwork.model.Contact;
//import com.d.hrwork.model.Leave;

import com.d.hrwork.model.User;
import com.d.hrwork.model.UserStatus;

public interface UserRepository extends JpaRepository<User, String> {

	@Modifying
	@Transactional
	public int deleteById(Long id);

	public User findById(Long id);

	@Modifying
	@Transactional
	@Query("Update User s SET s.status=:status WHERE s.id=:id")
	public int userActivate(@Param("id") Long id, @Param("status") UserStatus status);

	@Query("Select s from  User s WHERE s.userName=:userName AND s.password=:password")
	public User doLogin(@Param("userName") String userName, @Param("password") String password);

	@Query("Select s from  User s WHERE s.password=:password")
	public User findByPassword(@Param("password") String password);

	@Modifying
	@Transactional
	@Query("Update User s SET s.password=:password WHERE s.id=:id AND s.password=:oldpassword")
	public int resetPassword(@Param("oldpassword") String oldpassword, @Param("password") String password, @Param("id") Long id);

	@Query("Select s from  User s WHERE s.userName=:userName")
	public User findByUserName(@Param("userName") String userName);

	@Query("Select s from  User s WHERE s.userName=:userName ")
	public User findByUsername_security(@Param("userName") String userName);

	@Query("Select s from  User s WHERE s.id=:id")
	public User findResume(@Param("id") Long id);

}
