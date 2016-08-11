package com.d.hrwork.service.impl;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.d.hrwork.dao.LoginDao;
import com.d.hrwork.model.User;
import com.d.hrwork.service.LoginService;

@Service
@Transactional
public class LoginServiceImpl implements LoginService {
	@Autowired
	LoginDao loginDao;

/*	public com.d.hrwork.model.User SaveUser(com.d.hrwork.model.User user) {

		user.setManager(user);

		return loginDao.SaveUser(user);

	}*/

	public User doLogin(User user) {

		System.out.println("i am in login service and my userName---- "+user.getUserName() );
		System.out.println("i am in login service and my password---- "+user.getPassword() );
		
		
		return loginDao.doLogin(user);
	}

	public int resetPassword(String oldpassword, String password, Long id) {
		
		return loginDao.resetPassword(oldpassword,password,id);
	}

	public User findByUserName(String userName) {
		
		return loginDao.findByUserName(userName);
	}

	 @Transactional
	 public User datastore(MultipartFile file,User userString) throws IOException {
		
		return loginDao.datastore(file,userString);
	 }

	 public byte[] download() {
			
			return loginDao.getdownload();
			
		}
}
