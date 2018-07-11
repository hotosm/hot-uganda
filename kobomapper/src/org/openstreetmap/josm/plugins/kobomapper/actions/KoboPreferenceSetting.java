package org.openstreetmap.josm.plugins.kobomapper.actions;

import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.gui.preferences.DefaultTabPreferenceSetting;
import org.openstreetmap.josm.gui.preferences.PreferenceTabbedPane;
import org.openstreetmap.josm.plugins.kobomapper.KoboMapperPlugin;
import org.openstreetmap.josm.tools.GBC;
import org.openstreetmap.josm.tools.I18n;

import javax.swing.*;
import java.awt.*;

import static org.openstreetmap.josm.tools.I18n.tr;

public class KoboPreferenceSetting extends DefaultTabPreferenceSetting {
    JPanel jpanel;
    JLabel labelUsername;
    JLabel labelPassword;
    JLabel labelServer;
    JPanel p;



    private JTextField inputServer = new JTextField(20);
    private JTextField inputUsername = new JTextField(20);
    private JTextField inputPassword = new JTextField(20);


    public KoboPreferenceSetting() {
        super("hot_small.png", I18n.tr("Kobo Mapper Settings"),
                tr("handler for Kobo geotraces")
        );
    }

    @Override
    public void addGui(final PreferenceTabbedPane gui) {
        JPanel cadastrewmsMast = gui.createPreferenceTab(this);

        JPanel cadastrewms = new JPanel(new GridBagLayout());
        cadastrewms.setBorder(BorderFactory.createEmptyBorder(0, 0, 0, 0));


        p = new JPanel(new GridBagLayout());
        labelServer = new JLabel(tr("Server"));
        inputServer = new JTextField(Main.pref.get("kobo.server"));
        inputServer.setToolTipText(tr("Enter the url of the server running geoserver"));


        labelUsername = new JLabel(tr("Username"));
        inputUsername = new JTextField(Main.pref.get("kobo.username"));
        inputUsername.setToolTipText(tr("Username"));

        labelPassword = new JLabel(tr("Password"));
        inputPassword = new JTextField(Main.pref.get("kobo.password"));
        inputPassword.setToolTipText(tr("Password"));


        cadastrewms.add(labelServer, GBC.eop().insets(0, 0, 0, 0));
        cadastrewms.add(inputServer, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));

        cadastrewms.add(labelUsername, GBC.eop().insets(0, 0, 0, 0));
        cadastrewms.add(inputUsername, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));

        cadastrewms.add(labelPassword, GBC.eop().insets(0, 0, 0, 0));
        cadastrewms.add(inputPassword, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));






        // end of dialog, scroll bar
        cadastrewms.add(Box.createVerticalGlue(), GBC.eol().fill(GBC.VERTICAL));

        cadastrewmsMast.add(cadastrewms, GBC.eol().fill(GBC.BOTH));
    }


    @Override
    public boolean ok() {
        Main.pref.put("kobo.server", inputServer.getText());
        Main.pref.put("kobo.username", inputUsername.getText());
        Main.pref.put("kobo.password", inputPassword.getText());
        KoboMapperPlugin.refreshMenu();
        return false;
    }

}
