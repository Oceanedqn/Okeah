import { Link } from "react-router-dom";
import { styled } from "styled-components";

export const NavbarContainerStyle = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.background_alternatif};
  position: relative;
  z-index: 10;
`;

export const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
`;

export const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  span {
    height: 3px;
    width: 25px;
    background: ${({ theme }) => theme.colors.primary};
    margin-bottom: 5px;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Menu = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.background_alternatif};
    padding: 1rem 0;
    transition: transform 0.2s ease-in-out;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-200%)')};
    z-index: 100; /* Passe devant tout le reste */
  }
`;

export const MenuItem = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: color 0.3s;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary_light};
  }
`;