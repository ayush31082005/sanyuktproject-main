import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';

// 7. FOOTER BACKGROUND & SPACING
const FooterContainer = styled(Box)({
    backgroundColor: '#0D0D0D',
    color: '#F5E6C8',
    fontFamily: '"Inter", sans-serif',
    width: '100%',
    borderTop: '1px solid rgba(200, 169, 106, 0.4)',
});

const FooterContent = styled(Container)(({ theme }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    [theme?.breakpoints?.up('md') ?? '@media (min-width:900px)']: {
        paddingTop: '60px',
        paddingBottom: '60px',
    },
}));

// LOGO & INFO (COLUMN 1)
const LogoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    cursor: 'pointer',
});

const LogoImage = styled('img')({
    height: '80px',
    width: 'auto',
    objectFit: 'contain',
});

const LogoTextContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});

const LogoMain = styled('span')({
    fontFamily: '"Playfair Display", serif',
    fontWeight: 800,
    fontSize: '2.0rem',
    color: '#C8A96A',
    letterSpacing: '0.02em',
});

const CompanyDescription = styled(Typography)({
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#F5E6C8',
    opacity: 0.8,
    fontFamily: '"Inter", sans-serif',
    maxWidth: '320px',
    marginBottom: '24px',
});

// SECTION TITLES
const SectionTitle = styled(Typography)({
    fontSize: '16px',
    fontWeight: 700,
    color: '#C8A96A',
    marginBottom: '18px',
    fontFamily: '"Playfair Display", serif',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
});

// LINKS
const FooterLink = styled(Link)({
    display: 'block',
    color: '#F5E6C8',
    opacity: 0.8,
    fontSize: '14px',
    textDecoration: 'none',
    marginBottom: '10px',
    fontFamily: '"Inter", sans-serif',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        color: '#C8A96A',
        opacity: 1,
        paddingLeft: '4px',
    },
});

// CONTACT DETAILS (RIGHT SIDE OF COLUMN 3)
const ContactText = styled(Typography)({
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#C8A96A',
    opacity: 0.8,
    marginBottom: '8px',
    fontFamily: '"Poppins", "Roboto", sans-serif',
});

const ContactLine = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#F5E6C8', // Changed from #0A0A0A for better visibility
    opacity: 0.9,
    fontFamily: '"Poppins", "Roboto", sans-serif',
    transition: 'color 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        color: '#C9A84C',
    },
});

// SOCIAL ICONS
const SocialIconContainer = styled(Box)({
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
});

const SocialButton = styled('a')({
    color: '#C8A96A',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '2px',
    backgroundColor: 'rgba(200, 169, 106, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: '#C8A96A',
        color: '#0D0D0D',
        transform: 'translateY(-3px) scale(1.1)',
        boxShadow: '0 4px 12px rgba(200, 169, 106, 0.3)',
    },
});

// BOTTOM BAR
const BottomBar = styled(Box)({
    backgroundColor: '#121212',
    padding: '20px',
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
});

const CopyrightText = styled(Typography)({
    color: '#C8A96A',
    fontSize: '14px',
    fontFamily: '"Poppins", "Roboto", sans-serif',
    opacity: 0.8,
});

const Footer = () => {
    const [logoError, setLogoError] = useState(false);

    // COLUMN 2 - Quick Links (Exact order from instructions)
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/company/about' },
        { name: 'Company Profile', path: '/company/profile' },
        { name: 'Our Products', path: '/products' },
        { name: 'Opportunities', path: '/opportunities' },
        { name: 'Seminar List', path: '/seminars' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Downloads', path: '/downloads' },
        { name: 'Contact Us', path: '/contact' },
    ];

    // COLUMN 3 LEFT - Policies (Exact order from instructions)
    const policyLinks = [
        { name: 'Exchange Policy', path: '/exchange-policy' },
        { name: 'Marketing & Sales Policy', path: '/marketing-sales-policy' },
        { name: 'Order Policy', path: '/order-policy' },
        { name: 'Payment Policy', path: '/payment-policy' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms & Conditions', path: '/terms-conditions' },
        { name: 'Cancellation Policy', path: '/cancellation-policy' },
        { name: 'Shipping & Delivery Policy', path: '/shipment-delivery-policy' },
        { name: 'Testimonial Policy', path: '/testimonial-policy' },
        { name: 'Grievance', path: '/grievance' },
        { name: 'FAQ', path: '/faq' },
    ];

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const handleLogoError = () => {
        setLogoError(true);
    };

    return (
        <FooterContainer>
            <FooterContent>
                {/* 3 Columns Layout */}
                <Grid container spacing={4} justifyContent="space-between">

                    {/* COLUMN 1 - COMPANY INFO */}
                    <Grid item xs={12} md={4}>
                        <LogoContainer onClick={() => handleNavigation('/')} sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                            {!logoError && (
                                <LogoImage src="/logo.png?v=20260403d" alt="Sanyukt Parivaar Logo" onError={handleLogoError} />
                            )}
                        </LogoContainer>

                        <CompanyDescription>
                            Sanyukt Parivaar & Rich Life Pvt.Ltd. is a direct selling and network marketing organization founded by experienced professionals. We empower individuals to achieve financial independence by promoting high-quality lifestyle, wellness, personal care, and home utility products through a transparent and rewarding MLM business model.
                        </CompanyDescription>

                        <SocialIconContainer>
                            <SocialButton href="https://www.facebook.com/share/1CLin8tmY3/" target="_blank" aria-label="Facebook">
                                <FacebookIcon sx={{ fontSize: '18px' }} />
                            </SocialButton>
                            <SocialButton href="https://www.instagram.com/sanyukt_parivaar_rich_life_57?igsh=dDJlMDd0d241amRx" target="_blank" aria-label="Instagram">
                                <InstagramIcon sx={{ fontSize: '18px' }} />
                            </SocialButton>
                            <SocialButton href="https://www.youtube.com/@Sanyuktparivaarrichlife" target="_blank" aria-label="YouTube">
                                <YouTubeIcon sx={{ fontSize: '18px' }} />
                            </SocialButton>
                            <SocialButton href="https://x.com/sprichlife_57" target="_blank" aria-label="X">
                                <XIcon sx={{ fontSize: '16px' }} />
                            </SocialButton>
                        </SocialIconContainer>
                    </Grid>

                    {/* COLUMN 2 - QUICK LINKS */}
                    <Grid item xs={12} sm={6} md={2}>
                        <SectionTitle>Quick Links</SectionTitle>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {quickLinks.map((link, index) => (
                                <FooterLink key={index} onClick={() => handleNavigation(link.path)}>
                                    {link.name}
                                </FooterLink>
                            ))}
                        </Box>
                    </Grid>

                    {/* COLUMN 3 - POLICIES */}
                    <Grid item xs={12} sm={6} md={3}>
                        <SectionTitle>Our Policies</SectionTitle>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {policyLinks.map((link, index) => (
                                <FooterLink key={index} onClick={() => handleNavigation(link.path)}>
                                    {link.name}
                                </FooterLink>
                            ))}
                        </Box>
                    </Grid>

                    {/* COLUMN 4 - CONTACT US */}
                    <Grid item xs={12} sm={6} md={3}>
                        <SectionTitle>Contact Us</SectionTitle>
                        <Box sx={{ mb: 2 }}>
                            <ContactText sx={{ fontWeight: 700, mb: 1.5, color: '#C8A96A', fontSize: '15px' }}>
                                Sanyukt Parivaar & Rich Life Pvt.Ltd.
                            </ContactText>
                            <ContactText sx={{ fontWeight: 500, fontSize: '13px', borderLeft: '2px solid #C8A96A', pl: 1.5, mb: 2 }}>
                                Bhatiniya, Gopinathpur, Harraiya,<br />
                                Basti - 272130, Uttar Pradesh
                            </ContactText>
                        </Box>
                        <Box>
                            <ContactLine onClick={() => window.open('tel:+917880370057', '_self')}>
                                <Typography sx={{ fontWeight: 600, mr: 1, color: '#C8A96A', fontSize: '13px' }}>Phone:</Typography>
                                <Typography sx={{ color: '#F5E6C8', fontSize: '13px' }}>+91 78803 70057</Typography>
                            </ContactLine>
                            <ContactLine onClick={() => window.open('mailto:info@sanyuktparivaar.com', '_self')}>
                                <Typography sx={{ fontWeight: 600, mr: 1, color: '#C8A96A', fontSize: '13px' }}>Email:</Typography>
                                <Typography sx={{ color: '#F5E6C8', fontSize: '13px' }}>info@sanyuktparivaar.com</Typography>
                            </ContactLine>
                        </Box>
                    </Grid>



                </Grid>
            </FooterContent>

            {/* 11. FOOTER BOTTOM BAR */}
            <BottomBar>
                <Box sx={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: { xs: 1.5, md: 0 }
                }}>
                    <CopyrightText component="div">
                        © 2026 Sanyukt Parivaar & Rich Life Pvt.Ltd.. All Rights Reserved.
                    </CopyrightText>
                    <CopyrightText component="div" sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', opacity: 1, letterSpacing: '0.5px' }}>
                        POWERED BY
                        <Link
                            href="https://aigrowthexa.com"
                            target="_blank"
                            sx={{
                                ml: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none',
                                '&:hover': { opacity: 0.8 }
                            }}
                        >
                            <Box sx={{
                                background: '#C8A96A',
                                color: '#0A5F26',
                                px: 1,
                                py: 0.2,
                                borderRadius: '4px',
                                fontWeight: 900,
                                fontSize: '11px',
                                letterSpacing: '1px'
                            }}>
                                AI
                            </Box>
                            <Box sx={{
                                background: 'linear-gradient(90deg, #C8A96A 0%, #FFD700 50%, #C8A96A 100%)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 900,
                                fontSize: '15px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                animation: 'shimmer 3s linear infinite',
                                '@keyframes shimmer': {
                                    '0%': { backgroundPosition: '0% center' },
                                    '100%': { backgroundPosition: '200% center' }
                                }
                            }}>
                                GROWTH EXA
                            </Box>
                        </Link>
                    </CopyrightText>
                </Box>
            </BottomBar>
        </FooterContainer>
    );
};

export default Footer;
