package com.websocket.wstutorial.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WSController {

	// Inside your controller method
	@GetMapping("/username")
	@ResponseBody
	public String currentUserName() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = "";
		if (authentication != null) {
			Object principal = authentication.getPrincipal();
			username = principal instanceof UserDetails ? ((UserDetails) principal).getUsername()
					: principal.toString();
		}
		return username;
	}
	
	@GetMapping("/a")
    public String index(Model model) {
        String yourJavaVariable = "Some value from Java";
        model.addAttribute("yourJavaVariable", yourJavaVariable);
        return "index";
    }
}