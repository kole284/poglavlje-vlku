# Hetzner Unlock Request Template

## Informacije o incidentu:
- **Locking ID:** L0029C35A
- **Server IP:** 89.167.2.121
- **Datum:** 18. Februar 2026
- **Razlog:** DDoS attack detection - UDP flood to port 27015

---

## 📧 EMAIL TEMPLATE ZA HETZNER

**Kopiraj i pošalji ovo preko:** https://robot.hetzner.com/support/

---

### Subject:
```
Unlock Request L0029C35A - Security Issue Resolved and Mitigated
```

### Body:
```
Dear Hetzner Security Team,

I am writing to request the unlocking of server 89.167.2.121 (Locking ID: L0029C35A).

I have thoroughly investigated the DDoS attack incident and have taken comprehensive measures to resolve and prevent future occurrences.

## INVESTIGATION FINDINGS:

[OBAVEZNO POPUNITE - Što ste našli:]
□ Compromised process: [IME PROCESA ili "Not found - preventive measures taken"]
□ Attack vector: [Kako je došlo do napada - exploit, weak password, exposed service, etc.]
□ Duration: [Koliko dugo se dešavalo]

Example:
- Compromised process: Unknown UDP flooding process (PID 12345)
- Attack vector: SSH brute force with weak password
- Duration: Approximately 30 minutes until detection

## IMMEDIATE ACTIONS TAKEN:

✅ 1. Attack Mitigation:
   - Identified and terminated malicious process(es)
   - Blocked outbound UDP traffic to port 27015 using iptables
   - All suspicious processes have been stopped and removed

✅ 2. Password Security:
   - Changed root password (strong password with 20+ characters)
   - Changed all user account passwords
   - Implemented SSH key-based authentication only

✅ 3. SSH Hardening:
   - Disabled root login (PermitRootLogin no)
   - Disabled password authentication (PasswordAuthentication no)
   - Changed SSH port from 22 to [NOVI PORT]
   - Restricted SSH access to specific IP addresses (if applicable)

✅ 4. Firewall Configuration:
   - Installed and configured UFW firewall
   - Default policy: DENY incoming, ALLOW outgoing
   - Explicitly blocked UDP port 27015
   - Only allowed necessary ports:
     * SSH (port [PORT])
     * HTTP (port 80)
     * HTTPS (port 443)
   - Current firewall status: ACTIVE

✅ 5. Intrusion Detection:
   - Installed fail2ban with aggressive rules
   - Configured monitoring for SSH, HTTP, and other services
   - Set up email alerts for security events

✅ 6. System Security:
   - Updated all packages to latest versions
   - Performed full system scan with rkhunter/chkrootkit
   - Reviewed all running services and disabled unnecessary ones
   - Checked cron jobs and systemd timers for suspicious entries

✅ 7. Application Security:
   - Reviewed Docker container configurations
   - Ensured no unnecessary ports are exposed
   - Verified application credentials are secure
   - Implemented principle of least privilege for all services

## PREVENTIVE MEASURES IMPLEMENTED:

1. **Network Monitoring:**
   - Installed vnstat for bandwidth monitoring
   - Set up iftop for real-time traffic analysis
   - Configured alerts for unusual traffic patterns

2. **Regular Maintenance:**
   - Scheduled automatic security updates
   - Weekly security audit reviews
   - Regular log file analysis

3. **Access Control:**
   - Limited SSH access to specific IP addresses (whitelist)
   - Implemented 2FA for critical services
   - Regular audit of user accounts and permissions

4. **Backup Strategy:**
   - Configured automated daily backups
   - Verified backup restoration procedures
   - Secured backups in separate location

## VERIFICATION COMMANDS EXECUTED:

```bash
# Firewall status
sudo ufw status verbose

# No suspicious listening ports
sudo netstat -tulpn

# No outbound connections to port 27015
sudo netstat -nup | grep 27015

# fail2ban active
sudo systemctl status fail2ban

# System fully updated
sudo apt list --upgradable
```

## MONITORING PLAN:

Going forward, I will:
- Monitor server logs daily for the next 2 weeks
- Review firewall logs weekly
- Perform monthly security audits
- Keep all software updated promptly
- Maintain fail2ban and intrusion detection systems

## COMMITMENT:

I understand the severity of this incident and take full responsibility for the security of this server. I assure you that I have taken all necessary steps to prevent any recurrence of this or similar incidents.

The server is now secure, properly configured, and ready to resume normal operation. I will continue to monitor it closely and maintain high security standards.

Please let me know if you need any additional information or verification of the measures taken.

Thank you for your patience and understanding.

Best regards,
Nikola Kostic

---

Technical Details:
- Server: CAX11 #121057365
- IP: 89.167.2.121
- Locking ID: L0029C35A
- Date of incident: 2026-02-18
```

---

## ⚠️ PRE SLANJA - CHECKLIST:

- [ ] Popunio sam [ZAGRADAMA OZNAČENE] delove
- [ ] Stvarno sam izvršio SVE akcije koje sam naveo
- [ ] Firewall je AKTIVAN i potvrdio sam sa `sudo ufw status`
- [ ] Port 27015 je BLOKIRAN
- [ ] SSH je OJAČAN
- [ ] fail2ban je POKRENUT
- [ ] Lozinke su PROMENJENE
- [ ] Znam šta je uzrokovalo problem (ili ne znam ALI sam podigao bezbednost)
- [ ] Spreman sam da odgovorim na dodatna pitanja od Hetznera

---

## 📋 DODATNE INFORMACIJE AKO HETZNER PITA:

### "Kako ste identifikovali problem?"
```
I analyzed the provided log file showing UDP traffic to port 27015. 
I used netstat and ss commands to identify active connections.
I reviewed all running processes with ps and docker ps.
I found [SPECIFIČNO ŠTO STE NAŠLI].
```

### "Kako ste ga rešili?"
```
I terminated the malicious process using kill -9 [PID].
I immediately blocked the port using iptables.
I then implemented a comprehensive firewall strategy with UFW.
Full details are in the main message above.
```

### "Kako ste osigurali da se neće ponoviti?"
```
Multiple layers of security implemented:
1. Firewall blocking the specific port
2. SSH hardened with key-only authentication
3. fail2ban monitoring all services
4. Regular security audits scheduled
5. Monitoring tools in place for early detection
```

### "Da li možete potvrditi da je server čist?"
```
Yes. I have:
- Scanned with rkhunter: No threats found
- Checked all cron jobs: Clean
- Reviewed all systemd services: Only legitimate services running
- Monitored network traffic: No suspicious activity
- Updated all packages: System fully patched
```

---

## ⏱️ OČEKIVANO VREME ODGOVORA:

- Radnim danom: 4-24h
- Vikendom: 24-48h

**NAPOMENA:** NE šaljite više od jednog zahteva za isti Locking ID. To može usporiti proces!

---

## 📞 KONTAKT:

- **Hetzner Robot:** https://robot.hetzner.com
- **Support Portal:** https://robot.hetzner.com/support/
- **Guide:** https://docs.hetzner.com/robot/dedicated-server/troubleshooting/guideline-in-case-of-server-locking/
