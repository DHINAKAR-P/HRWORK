package com.d.hrwork.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.d.hrwork.model.User;

public interface LoginService {

	/*public User SaveUser(User user);*/

	public User doLogin(User user);

	public int resetPassword(String oldpassword, String password, Long id);

	public User findByUserName(String userName);

	public User datastore( MultipartFile file,User user) throws IOException; 
	public byte[] download(); 

	 

}